import { View, Text, TouchableOpacity } from 'react-native';
import { Order, OrderStatus } from '@/types';
import OrderStatusBadge from './OrderStatusBadge';
import { MaterialIcons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface OrderCardProps {
  order: Order;
  isSupplier?: boolean;
}

const OrderCard = ({ order, isSupplier = false }: OrderCardProps) => {
  const getActionDetails = () => {
    if (isSupplier) {
      return {
        icon: 'local-shipping',
        text: 'Detalhes do Pedido',
      };
    }
    return {
      icon: 'info',
      text: 'Acompanhar Entrega',
    };
  };

  const action = getActionDetails();

  return (
    <View className="bg-white rounded-lg shadow-sm p-4 mb-3 border border-gray-100">
      <View className="flex-row justify-between items-start mb-2">
        <Text className="text-lg font-semibold text-gray-800">
          Pedido #{order.id.substring(0, 6).toUpperCase()}
        </Text>
        <OrderStatusBadge status={order.status} />
      </View>

      <View className="mb-3">
        <Text className="text-gray-600 mb-1">
          {isSupplier ? 'Cliente' : 'Fornecedor'}:{' '}
          <Text className="font-medium">{isSupplier ? order.consumerId : order.supplierId}</Text>
        </Text>
        <Text className="text-gray-600 mb-1">
          Quantidade: <Text className="font-medium">{order.quantity} litros</Text>
        </Text>
        <Text className="text-gray-600 mb-1">
          Total: <Text className="font-medium">{order.price?.toFixed(2)} Kz</Text>
        </Text>
        <Text className="text-gray-600">
          Data: <Text className="font-medium">
            {format(order.createdAt, "dd MMM yyyy, HH:mm", { locale: pt })}
          </Text>
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => router.push(`/orders/${order.id}`)}
        className="flex-row items-center justify-center py-2 bg-blue-50 rounded-lg mt-2"
      >
        <MaterialIcons name={action.icon} size={18} color="#3b82f6" />
        <Text className="text-blue-600 ml-2 font-medium">{action.text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderCard;