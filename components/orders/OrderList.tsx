import { FlatList, View, Text } from 'react-native';
import OrderCard from './OrderCard';
import { Order } from '@/types';
import { useAuth } from '@/context/AuthContext';

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  isSupplierView?: boolean;
}

const OrderList = ({ orders, loading, isSupplierView = false }: OrderListProps) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text className="text-gray-500">Carregando pedidos...</Text>
      </View>
    );
  }

  if (orders.length === 0) {
    return (
      <View className="flex-1 justify-center items-center mt-8">
        <Text className="text-gray-500">Nenhum pedido encontrado</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={orders}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <OrderCard order={item} isSupplier={isSupplierView} />
      )}
      contentContainerStyle={{ paddingBottom: 20 }}
      showsVerticalScrollIndicator={false}
    />
  );
};

export default OrderList;