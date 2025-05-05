import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, Order, OrderStatus, Notification } from '@/types';
import { useAuth } from './AuthContext';
import * as SecureStore from 'expo-secure-store';

// Tipo para localização geográfica
type Location = {
  lat: number;
  lng: number;
};

// Tipagem do contexto
interface OrderContextProps {
  orders: Order[];
  notifications: Notification[];
  unreadNotificationsCount: number;
  getRecentOrders: () => Order[];
  getOrderById: (id: string) => Order | undefined;
  getNearbySuppliers: (userLocation: Location) => User[];
  createOrder: (orderData: Partial<Order>) => Promise<void>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<void>;
  acceptOrder: (orderId: string, supplierId: string) => Promise<void>;
  markNotificationAsRead: (notificationId: string) => void;
}

// Criação do contexto
const OrderContext = createContext<OrderContextProps | undefined>(undefined);

// Provider do contexto
export const OrderProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();

  const [orders, setOrders] = useState<Order[]>(() => {
    const stored = SecureStore.getItem('agua_expressa_orders');
    return stored ? JSON.parse(stored) : [];
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const stored = SecureStore.getItem('agua_expressa_notifications');
    return stored ? JSON.parse(stored) : [];
  });

  const saveOrdersToSecureStore = useCallback((newOrders: Order[]) => {
    SecureStore.setItem('agua_expressa_orders', JSON.stringify(newOrders));
  }, []);

  const saveNotificationsToSecureStore = useCallback((newNotifications: Notification[]) => {
    SecureStore.setItem('agua_expressa_notifications', JSON.stringify(newNotifications));
  }, []);

  const getRecentOrders = useCallback(() => {
    if (!user) return [];

    return user.userType === 'consumer'
      ? orders.filter(order => order.consumerId === user.id)
      : orders.filter(order => order.supplierId === user.id || order.status === 'pending');
  }, [user, orders]);

  const getOrderById = useCallback((id: string) => {
    return orders.find(order => order.id === id);
  }, [orders]);

  const getNearbySuppliers = useCallback((userLocation: Location) => {
    const usersJson = SecureStore.getItem('agua_expressa_users') || '[]';
    const users = JSON.parse(usersJson) as User[];

    const suppliers = users
      .filter(user => user.userType === 'supplier')
      .map(supplier => {
        const location = (supplier as any).location as Location;
        const distanceKm = calculateDistance(
          userLocation.lat, userLocation.lng,
          location.lat, location.lng
        );
        return { ...supplier, distanceKm };
      })
      .sort((a: any, b: any) => a.distanceKm - b.distanceKm);

    return suppliers;
  }, []);

  const createOrder = useCallback(async (orderData: Partial<Order>) => {
    if (!user) throw new Error('User not authenticated');

    const newOrder: Order = {
      id: Math.random().toString(36).substring(2, 15),
      consumerId: user.id,
      createdAt: new Date(),
      status: 'pending',
      ...orderData,
    } as Order;

    const updatedOrders = [...orders, newOrder];
    setOrders(updatedOrders);
    saveOrdersToSecureStore(updatedOrders);

    // Notificar fornecedores
    const usersJson = SecureStore.getItem('agua_expressa_users') || '[]';
    const users = JSON.parse(usersJson) as User[];
    const suppliers = users.filter(u => u.userType === 'supplier');

    const newNotifications = suppliers.map(supplier => ({
      id: Math.random().toString(36).substring(2, 15),
      userId: supplier.id,
      title: 'Novo pedido próximo',
      message: 'Novo pedido de água próximo a você!',
      relatedOrderId: newOrder.id,
      createdAt: new Date(),
      read: false,
    }));

    const updatedNotifications = [...notifications, ...newNotifications];
    setNotifications(updatedNotifications);
    saveNotificationsToSecureStore(updatedNotifications);
  }, [user, orders, notifications, saveOrdersToSecureStore, saveNotificationsToSecureStore]);

  const updateOrderStatus = useCallback(async (orderId: string, status: OrderStatus) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, status, updatedAt: new Date() }
        : order
    );

    setOrders(updatedOrders);
    saveOrdersToSecureStore(updatedOrders);

    const order = orders.find(o => o.id === orderId);
    if (order) {
      const notification: Notification = {
        id: Math.random().toString(36).substring(2, 15),
        userId: order.consumerId,
        title: 'Atualização do pedido',
        message: `Seu pedido foi ${status}!`,
        relatedOrderId: order.id,
        createdAt: new Date(),
        read: false,
      };

      const updatedNotifications = [...notifications, notification];
      setNotifications(updatedNotifications);
      saveNotificationsToSecureStore(updatedNotifications);
    }
  }, [orders, notifications, saveOrdersToSecureStore, saveNotificationsToSecureStore]);

  const acceptOrder = useCallback(async (orderId: string, supplierId: string) => {
    const updatedOrders = orders.map(order =>
      order.id === orderId
        ? { ...order, supplierId, status: 'accepted', acceptedAt: new Date() }
        : order
    );

    setOrders(updatedOrders as any);
    saveOrdersToSecureStore(updatedOrders as any);

    const order = orders.find(o => o.id === orderId);
    if (order) {
      const notification: Notification = {
        id: Math.random().toString(36).substring(2, 15),
        userId: order.consumerId,
        title: 'Pedido aceito',
        message: 'Seu pedido foi aceito!',
        relatedOrderId: order.id,
        createdAt: new Date(),
        read: false,
      };

      const updatedNotifications = [...notifications, notification];
      setNotifications(updatedNotifications);
      saveNotificationsToSecureStore(updatedNotifications);
    }
  }, [orders, notifications, saveOrdersToSecureStore, saveNotificationsToSecureStore]);

  const markNotificationAsRead = useCallback((notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );

    setNotifications(updatedNotifications);
    saveNotificationsToSecureStore(updatedNotifications);
  }, [notifications, saveNotificationsToSecureStore]);

  const unreadNotificationsCount = notifications.filter(n => !n.read && n.userId === user?.id).length;

  return (
    <OrderContext.Provider
      value={{
        orders,
        notifications,
        unreadNotificationsCount,
        getRecentOrders,
        getOrderById,
        getNearbySuppliers,
        createOrder,
        updateOrderStatus,
        acceptOrder,
        markNotificationAsRead,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
};

// Hook para usar o contexto
export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) throw new Error('useOrders must be used within an OrderProvider');
  return context;
};

// Utilitário para calcular distância entre dois pontos
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg: number): number => deg * (Math.PI / 180);
