import { View, Text } from 'react-native';
import { OrderStatus } from '@/types';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  accepted: 'bg-blue-100 text-blue-800',
  in_transit: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  canceled: 'bg-red-100 text-red-800',
};

const statusText = {
  pending: 'Pendente',
  accepted: 'Aceito',
  in_transit: 'Em transporte',
  delivered: 'Entregue',
  canceled: 'Cancelado',
};

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => (
  <View className={`px-2 py-1 rounded-full ${statusColors[status]}`}>
    <Text className={`text-xs font-medium ${statusColors[status].split(' ')[1]}`}>
      {statusText[status]}
    </Text>
  </View>
);

export default OrderStatusBadge;