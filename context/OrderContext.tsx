import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Order, OrderStatus, Notification, Supplier } from '@/types';
import { useAuth } from './AuthContext';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  onSnapshot,
  writeBatch,
  serverTimestamp,
  Timestamp,
  getDoc,
  or
} from 'firebase/firestore';
import { Alert } from 'react-native';
import { db } from '@/services/firebase';

type OrderContextProps = {
  orders: Order[];
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  suppliers: Supplier[];
  getOrderById: (orderId: string) => Promise<Order>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  fetchSupplierOrders: (supplierId: string) => Promise<Order[]>;
  fetchConsumerOrders: (consumerId: string) => Promise<Order[]>;
  fetchAllSuppliers: () => Promise<void>;
};

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);

  // Converter Firestore Timestamp para Date
  const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date | undefined => {
    if (!timestamp) return undefined;
    if (timestamp instanceof Date) return timestamp;
    return timestamp.toDate();
  };

  // Buscar todos os fornecedores
  const fetchAllSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      const suppliersRef = collection(db, 'users');
      const q = query(
        suppliersRef, 
        where('userType', '==', 'supplier')
      );
      
      const suppliersSnapshot = await getDocs(q);
      
      const suppliersData = suppliersSnapshot.docs
        .map(doc =>  doc.data() as Supplier)
        .filter(supplier => supplier.online); 
      console.log('resultado',suppliersData)
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar um pedido por ID
  const getOrderById = useCallback(async (orderId: string): Promise<Order> => {
    try {
      if (!orderId) throw new Error('ID do pedido não fornecido');

      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);

      if (!orderSnap.exists()) {
        throw new Error('Pedido não encontrado');
      }

      const orderData = orderSnap.data();
      if (!orderData.consumerId || !orderData.status) {
        throw new Error('Dados do pedido incompletos');
      }

      return {
        id: orderSnap.id,
        consumerId: orderData.consumerId,
        supplierId: orderData.supplierId || '',
        quantity: orderData.quantity || 0,
        status: orderData.status,
        location: orderData.location || { address: '', lat: 0, lng: 0 },
        price: orderData.price || 0,
        createdAt: convertTimestamp(orderData.createdAt) || new Date(),
        acceptedAt: convertTimestamp(orderData.acceptedAt),
        deliveredAt: convertTimestamp(orderData.deliveredAt),
        canceledAt: convertTimestamp(orderData.canceledAt),
      } as Order;
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  // Ouvir mudanças nos pedidos em tempo real
  useEffect(() => {
    if (!user?.id) return;

    setLoading(true);
    const fieldToQuery = user.userType === 'supplier' ? 'supplierId' : 'consumerId';
    const ordersQuery = query(
      collection(db, 'orders'),
      where(fieldToQuery, '==', user.id)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, 
      (snapshot) => {
        const ordersData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            consumerId: data.consumerId,
            supplierId: data.supplierId || '',
            quantity: data.quantity || 0,
            status: data.status,
            location: data.location || { address: '', lat: 0, lng: 0 },
            price: data.price || 0,
            createdAt: convertTimestamp(data.createdAt) || new Date(),
            acceptedAt: convertTimestamp(data.acceptedAt),
            deliveredAt: convertTimestamp(data.deliveredAt),
            canceledAt: convertTimestamp(data.canceledAt),
          } as Order;
        });
        setOrders(ordersData);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribeOrders();
  }, [user?.id, user?.userType]);

  // Ouvir notificações em tempo real
  useEffect(() => {
    if (!user?.id) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      where('read', '==', false)
    );

    const unsubscribeNotifications = onSnapshot(
      notificationsQuery,
      (snapshot) => {
        const notificationsData = snapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            userId: data.userId,
            title: data.title || '',
            message: data.message || '',
            read: data.read || false,
            relatedOrderId: data.relatedOrderId || '',
            createdAt: convertTimestamp(data.createdAt) || new Date(),
          } as Notification;
        });
        setNotifications(notificationsData);
      },
      (err) => {
        console.error("Erro na consulta de notificações:", err);
        setError(err.message);
      }
    );

    return () => unsubscribeNotifications();
  }, [user?.id]);

  // Criar um novo pedido
  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    try {
      if (!user?.id) {
        throw new Error('Usuário não autenticado');
      }

      // Validação dos dados do pedido
      if (!orderData.supplierId || !orderData.consumerId || !orderData.quantity || !orderData.location) {
        throw new Error('Dados do pedido incompletos');
      }

      setLoading(true);
      
      const orderRef = doc(collection(db, 'orders'));
      const newOrder: Order = {
        ...orderData,
        id: orderRef.id,
        status: 'pending',
        createdAt: new Date(),
      };

      await setDoc(orderRef, {
        ...newOrder,
        createdAt: serverTimestamp(),
      });

      // Criar notificações em lote
      const batch = writeBatch(db);
      
      // Notificação para o fornecedor
      const supplierNotificationRef = doc(collection(db, 'notifications'));
      batch.set(supplierNotificationRef, {
        userId: orderData.supplierId,
        title: 'Novo Pedido Recebido',
        message: `Novo pedido de ${orderData.quantity} litros`,
        read: false,
        relatedOrderId: orderRef.id,
        createdAt: serverTimestamp(),
      });

      // Notificação para o consumidor
      const consumerNotificationRef = doc(collection(db, 'notifications'));
      batch.set(consumerNotificationRef, {
        userId: user.id,
        title: 'Pedido Criado',
        message: 'Seu pedido foi registrado com sucesso',
        read: false,
        relatedOrderId: orderRef.id,
        createdAt: serverTimestamp(),
      });

      await batch.commit();
      
      Alert.alert('Sucesso', 'Pedido criado com sucesso!');
    } catch (err) {
      console.error('Erro ao criar pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao criar pedido');
      Alert.alert('Erro', 'Falha ao criar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar status do pedido
  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
      if (!orderId) throw new Error('ID do pedido não fornecido');

      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      
      const updateData: Partial<Order> = { 
        status,
        ...(status === 'accepted' && { acceptedAt: new Date() }),
        ...(status === 'in_transit' && { inTransitAt: new Date() }),
        ...(status === 'delivered' && { deliveredAt: new Date() }),
        ...(status === 'canceled' && { canceledAt: new Date() }),
      };

      await updateDoc(orderRef, {
        ...updateData,
        ...(status === 'accepted' && { acceptedAt: serverTimestamp() }),
        ...(status === 'in_transit' && { inTransitAt: serverTimestamp() }),
        ...(status === 'delivered' && { deliveredAt: serverTimestamp() }),
        ...(status === 'canceled' && { canceledAt: serverTimestamp() }),
      });

      // Criar notificação para o consumidor
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const notificationRef = doc(collection(db, 'notifications'));
        await setDoc(notificationRef, {
          userId: order.consumerId,
          title: `Pedido ${status}`,
          message: `Seu pedido foi atualizado para: ${translateStatus(status)}`,
          read: false,
          relatedOrderId: orderId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Erro ao atualizar pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao atualizar pedido');
      Alert.alert('Erro', 'Falha ao atualizar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Aceitar um pedido (para fornecedores)
  const acceptOrder = async (orderId: string) => {
    try {
      if (!user?.id || user.userType !== 'supplier') {
        throw new Error('Apenas fornecedores podem aceitar pedidos');
      }

      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      
      await updateDoc(orderRef, {
        status: 'accepted',
        supplierId: user.id,
        acceptedAt: serverTimestamp(),
      });

      // Notificar o consumidor
      const order = orders.find(o => o.id === orderId);
      if (order) {
        const notificationRef = doc(collection(db, 'notifications'));
        await setDoc(notificationRef, {
          userId: order.consumerId,
          title: 'Pedido Aceito',
          message: `Seu pedido foi aceito por ${user.name || 'o fornecedor'}`,
          read: false,
          relatedOrderId: orderId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      console.error('Erro ao aceitar pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao aceitar pedido');
      Alert.alert('Erro', 'Falha ao aceitar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Cancelar um pedido
  const cancelOrder = async (orderId: string) => {
    try {
      if (!orderId) throw new Error('ID do pedido não fornecido');

      setLoading(true);
      await updateOrderStatus(orderId, 'canceled');
    } catch (err) {
      console.error('Erro ao cancelar pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao cancelar pedido');
      Alert.alert('Erro', 'Falha ao cancelar pedido');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Marcar notificação como lida
  const markNotificationAsRead = async (notificationId: string) => {
    try {
      if (!notificationId) throw new Error('ID da notificação não fornecido');

      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
    } catch (err) {
      console.error('Erro ao marcar notificação como lida:', err);
      setError(err instanceof Error ? err.message : 'Erro ao marcar notificação como lida');
      throw err;
    }
  };

  // Buscar pedidos de um fornecedor
  const fetchSupplierOrders = async (supplierId: string): Promise<Order[]> => {
    try {
      if (!supplierId) throw new Error('ID do fornecedor não fornecido');

      setLoading(true);
      const q = query(collection(db, 'orders'), where('supplierId', '==', supplierId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          consumerId: data.consumerId,
          supplierId: data.supplierId || '',
          quantity: data.quantity || 0,
          status: data.status,
          location: data.location || { address: '', lat: 0, lng: 0 },
          price: data.price || 0,
          createdAt: convertTimestamp(data.createdAt) || new Date(),
          acceptedAt: convertTimestamp(data.acceptedAt),
          deliveredAt: convertTimestamp(data.deliveredAt),
          canceledAt: convertTimestamp(data.canceledAt),
        } as Order;
      });
    } catch (err) {
      console.error('Erro ao buscar pedidos do fornecedor:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedidos do fornecedor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar pedidos de um consumidor
  const fetchConsumerOrders = async (consumerId: string): Promise<Order[]> => {
    try {
      if (!consumerId) throw new Error('ID do consumidor não fornecido');

      setLoading(true);
      const q = query(collection(db, 'orders'), where('consumerId', '==', consumerId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          consumerId: data.consumerId,
          supplierId: data.supplierId || '',
          quantity: data.quantity || 0,
          status: data.status,
          location: data.location || { address: '', lat: 0, lng: 0 },
          price: data.price || 0,
          createdAt: convertTimestamp(data.createdAt) || new Date(),
          acceptedAt: convertTimestamp(data.acceptedAt),
          deliveredAt: convertTimestamp(data.deliveredAt),
          canceledAt: convertTimestamp(data.canceledAt),
        } as Order;
      });
    } catch (err) {
      console.error('Erro ao buscar pedidos do consumidor:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedidos do consumidor');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Traduzir status do pedido
  const translateStatus = (status: OrderStatus): string => {
    const translations = {
      pending: 'Pendente',
      accepted: 'Aceito',
      in_transit: 'Em Trânsito',
      delivered: 'Entregue',
      canceled: 'Cancelado',
    };
    return translations[status] || status;
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        notifications,
        unreadCount,
        suppliers,
        loading,
        error,
        getOrderById,
        createOrder,
        updateOrderStatus,
        acceptOrder,
        cancelOrder,
        markNotificationAsRead,
        fetchSupplierOrders,
        fetchConsumerOrders,
        fetchAllSuppliers,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};