import { View, SafeAreaView, Text } from 'react-native';
import { useState, useEffect } from 'react';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import OrderFilters from '@/components/orders/OrderFilters';
import OrderList from '@/components/orders/OrderList';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { router } from 'expo-router';
import { OrderStatus } from '@/types';

const OrdersScreen = () => {
  const { user } = useAuth();
  const { orders, fetchConsumerOrders, fetchSupplierOrders, loading } = useOrders();
  const [filteredOrders, setFilteredOrders] = useState(orders);
  const isSupplier = user?.userType === 'supplier';

  useEffect(() => {
    if (user) {
      isSupplier ? fetchSupplierOrders(user.id) : fetchConsumerOrders(user.id);
    }
  }, [user]);

  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders]);

  const handleFilterChange = (filters: {
    status?: OrderStatus | 'all';
    startDate?: Date | null;
    endDate?: Date | null;
  }) => {
    let result = [...orders];

    if (filters.status && filters.status !== 'all') {
      result = result.filter((order) => order.status === filters.status);
    }

    if (filters.startDate) {
      result = result.filter(
        (order) => new Date(order.createdAt) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      const endOfDay = new Date(filters.endDate);
      endOfDay.setHours(23, 59, 59, 999);
      result = result.filter(
        (order) => new Date(order.createdAt) <= endOfDay
      );
    }

    setFilteredOrders(result);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-4 pt-4">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialCommunityIcons name="arrow-left" size={24} color="#4b5563" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">
            {isSupplier ? 'Pedidos Recebidos' : 'Meus Pedidos'}
          </Text>
          <View style={{ width: 24 }} />
        </View>

        <OrderFilters onFilterChange={handleFilterChange} />
      </View>

      <View className="flex-1 px-4">
        <OrderList 
          orders={filteredOrders} 
          loading={loading} 
          isSupplierView={isSupplier} 
        />
      </View>
    </SafeAreaView>
  );
};

export default OrdersScreen;