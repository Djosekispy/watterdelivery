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
  getDoc
} from 'firebase/firestore';
import { Alert } from 'react-native';
import { db } from '@/services/firebase';

type OrderContextProps = {
  orders: Order[];
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
  suppliers : Supplier[];
  getOrderById : (orderId: string) => Promise<Order>;
  createOrder: (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  acceptOrder: (orderId: string) => Promise<void>;
  cancelOrder: (orderId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => Promise<void>;
  fetchSupplierOrders: (supplierId: string) => Promise<Order[]>;
  fetchConsumerOrders: (consumerId: string) => Promise<Order[]>;
};

const OrderContext = createContext<OrderContextProps | undefined>(undefined);

export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ suppliers, setSuppliers ] = useState<Supplier[]>([])

  const fetchAllSuppliers = async () => {
    try {
      const suppliersRef = collection(db, 'users');
      const q = query(suppliersRef, where('userType', '==', 'supplier'));
      const suppliersSnapshot = await getDocs(q);
      
      const suppliersData = suppliersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Supplier[];
      
      setSuppliers(suppliersData);
    } catch (err) {
      console.error('Erro ao buscar fornecedores:', err);
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    }
  };

  useEffect(() => {
    fetchAllSuppliers();
  }, []);

  // Converter Firestore Timestamp para Date
  const convertTimestamp = (timestamp: Timestamp | Date | undefined): Date | undefined => {
    if (!timestamp) return undefined;
    if (timestamp instanceof Date) return timestamp;
    return timestamp.toDate();
  };

  // Ouvir mudanças nos pedidos em tempo real
  useEffect(() => {
    if (!user) return;

    setLoading(true);
    const ordersQuery = query(
      collection(db, 'orders'),
      where(user.userType === 'supplier' ? 'supplierId' : 'consumerId', '==', user.id)
    );

    const unsubscribeOrders = onSnapshot(ordersQuery, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          acceptedAt: convertTimestamp(data.acceptedAt),
          deliveredAt: convertTimestamp(data.deliveredAt),
          canceledAt: convertTimestamp(data.canceledAt),
        } as Order;
      });
      setOrders(ordersData);
      setLoading(false);
    }, (err) => {
      setError(err as any);
      setLoading(false);
    });

    return () => unsubscribeOrders();
  }, [user]);

  // Ouvir notificações em tempo real
  useEffect(() => {
    if (!user) return;

    const notificationsQuery = query(
      collection(db, 'notifications'),
      where('userId', '==', user.id),
      where('read', '==', false)
    );

    const unsubscribeNotifications = onSnapshot(notificationsQuery, (snapshot) => {
      const notificationsData = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
        } as Notification;
      });
      setNotifications(notificationsData);
    });

    return () => unsubscribeNotifications();
  }, [user]);

  const createOrder = async (orderData: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    try {
      if (!user) throw new Error('Usuário não autenticado');

      setLoading(true);
      
      // 1. Criar o pedido
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

      // 2. Criar notificações
      const batch = writeBatch(db);
      
      // Notificação para o fornecedor
      if (orderData.supplierId) {
        const supplierNotificationRef = doc(collection(db, 'notifications'));
        batch.set(supplierNotificationRef, {
          userId: orderData.supplierId,
          title: 'Novo Pedido Recebido',
          message: `Novo pedido de ${orderData.quantity} litros`,
          read: false,
          relatedOrderId: orderRef.id,
          createdAt: serverTimestamp(),
        });
      }

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
      setError(err as any);
      Alert.alert('Erro', 'Falha ao criar pedido');
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus) => {
    try {
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

      // Criar notificação
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
      setError(err as any);
      Alert.alert('Erro', 'Falha ao atualizar pedido');
    } finally {
      setLoading(false);
    }
  };

  const acceptOrder = async (orderId: string) => {
    if (!user || user.userType !== 'supplier') {
      Alert.alert('Erro', 'Apenas fornecedores podem aceitar pedidos');
      return;
    }

    try {
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
          message: `Seu pedido foi aceito por ${user.name}`,
          read: false,
          relatedOrderId: orderId,
          createdAt: serverTimestamp(),
        });
      }
    } catch (err) {
      setError(err as any);
      Alert.alert('Erro', 'Falha ao aceitar pedido');
    } finally {
      setLoading(false);
    }
  };

  const cancelOrder = async (orderId: string) => {
    try {
      setLoading(true);
      await updateOrderStatus(orderId, 'canceled');
    } catch (err) {
      setError(err as any);
      Alert.alert('Erro', 'Falha ao cancelar pedido');
    } finally {
      setLoading(false);
    }
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      const notificationRef = doc(db, 'notifications', notificationId);
      await updateDoc(notificationRef, {
        read: true,
      });
    } catch (err) {
      setError(err as any);
    }
  };

  const fetchSupplierOrders = async (supplierId: string): Promise<Order[]> => {
    try {
      setLoading(true);
      const q = query(collection(db, 'orders'), where('supplierId', '==', supplierId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          acceptedAt: convertTimestamp(data.acceptedAt),
          deliveredAt: convertTimestamp(data.deliveredAt),
          canceledAt: convertTimestamp(data.canceledAt),
        } as Order;
      });
    } catch (err) {
      setError(err as any);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getOrderById = useCallback(async (orderId: string): Promise<Order> => {
    try {
      setLoading(true);
      const orderRef = doc(db, 'orders', orderId);
      const orderSnap = await getDoc(orderRef);
  
      if (!orderSnap.exists()) {
        throw new Error('Pedido não encontrado');
      }
  
      const orderData = orderSnap.data();
      return {
        id: orderSnap.id,
        ...orderData,
        createdAt: convertTimestamp(orderData.createdAt),
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

  const fetchConsumerOrders = async (consumerId: string): Promise<Order[]> => {
    try {
      setLoading(true);
      const q = query(collection(db, 'orders'), where('consumerId', '==', consumerId));
      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: convertTimestamp(data.createdAt),
          acceptedAt: convertTimestamp(data.acceptedAt),
          deliveredAt: convertTimestamp(data.deliveredAt),
          canceledAt: convertTimestamp(data.canceledAt),
        } as Order;
      });
    } catch (err) {
      setError(err as any);
      return [];
    } finally {
      setLoading(false);
    }
  };

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