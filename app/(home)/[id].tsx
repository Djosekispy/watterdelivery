import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Order, OrderStatus } from '@/types';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import OrderStatusBadge from '@/components/orders/OrderStatusBadge';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { getUserById } from '@/services/userService';
import { User } from '@/types';

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams();
  const { getOrderById, updateOrderStatus, loading } = useOrders();
  const { user } = useAuth();
  
  const [order, setOrder] = useState<Order | null>(null);
  const [userDetails, setUserDetails] = useState<User | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Determina se o usuário atual é o fornecedor deste pedido
  const isSupplier = user?.userType === 'supplier';
  const isOrderSupplier = order?.supplierId === user?.id;
  const isOrderConsumer = order?.consumerId === user?.id;

  // Carrega os dados do pedido e do usuário relacionado
  useEffect(() => {
    const loadData = async () => {
      try {
        const orderData = await getOrderById(id as string);
        setOrder(orderData);

        if (orderData) {
          const userIdToFetch = isSupplier ? orderData.consumerId : orderData.supplierId;
          if (userIdToFetch) {
            const userData = await getUserById(userIdToFetch);
            console.log(JSON.stringify(userData));
            setUserDetails(userData);
          }
        }
      } catch (error) {
        Alert.alert('Erro', 'Não foi possível carregar os detalhes do pedido');
        router.back();
      }
    };

    loadData();
  }, [id]);

  const handleStatusUpdate = async (newStatus: OrderStatus) => {
    setActionLoading(true);
    try {
      await updateOrderStatus(id as string, newStatus);
      // Atualiza o estado local para refletir a mudança imediatamente
      setOrder(prev => prev ? { ...prev, status: newStatus } : null);
      Alert.alert('Sucesso', `Status do pedido atualizado para: ${translateStatus(newStatus)}`);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o status do pedido');
    } finally {
      setActionLoading(false);
    }
  };

  const translateStatus = (status: OrderStatus): string => {
    const translations = {
      pending: 'Pendente',
      accepted: 'Aceito',
      in_transit: 'Em Transporte',
      delivered: 'Entregue',
      canceled: 'Cancelado',
    };
    return translations[status] || status;
  };

  const getStatusActions = () => {
    if (!order || !user) return [];

    const actions = [];
    
    // Ações para fornecedores
    if (isSupplier && isOrderSupplier) {
      if (order.status === 'pending') {
        actions.push({
          label: 'Aceitar Pedido',
          icon: 'check-circle',
          action: () => handleStatusUpdate('accepted'),
          color: 'bg-green-100 text-green-800',
        });
        actions.push({
          label: 'Recusar Pedido',
          icon: 'cancel',
          action: () => handleStatusUpdate('canceled'),
          color: 'bg-red-100 text-red-800',
        });
      }

      if (order.status === 'accepted') {
        actions.push({
          label: 'Iniciar Entrega',
          icon: 'local-shipping',
          action: () => handleStatusUpdate('in_transit'),
          color: 'bg-blue-100 text-blue-800',
        });
      }

      if (order.status === 'in_transit') {
        actions.push({
          label: 'Confirmar Entrega',
          icon: 'check-circle',
          action: () => handleStatusUpdate('delivered'),
          color: 'bg-green-100 text-green-800',
        });
      }
    }

    // Ações para clientes
    if (!isSupplier && isOrderConsumer && order.status === 'pending') {
      actions.push({
        label: 'Cancelar Pedido',
        icon: 'cancel',
        action: () => handleStatusUpdate('canceled'),
        color: 'bg-red-100 text-red-800',
      });
    }

    return actions;
  };

  if (!order) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 justify-center items-center">
        <Text className="text-gray-500">Carregando detalhes do pedido...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-6 pt-10">
        {/* Cabeçalho */}
        <View className="flex-row justify-between items-center mb-6">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Detalhes do Pedido</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Card de status */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-lg font-semibold">
              Pedido #{order.id.substring(0, 6).toUpperCase()}
            </Text>
            <OrderStatusBadge status={order.status} />
          </View>

          <View className="border-t border-gray-100 pt-3">
            <View className="flex-row justify-between mb-2">
              <Text className="text-gray-600">Data do Pedido:</Text>
              <Text className="font-medium">
                {format(order.createdAt, "dd MMM yyyy 'às' HH:mm", { locale: pt })}
              </Text>
            </View>

            {order.acceptedAt && (
              <View className="flex-row justify-between mb-2">
                <Text className="text-gray-600">Data de Aceitação:</Text>
                <Text className="font-medium">
                  {format(order.acceptedAt, "dd MMM yyyy 'às' HH:mm", { locale: pt })}
                </Text>
              </View>
            )}

            {order.deliveredAt && (
              <View className="flex-row justify-between">
                <Text className="text-gray-600">Data de Entrega:</Text>
                <Text className="font-medium">
                  {format(order.deliveredAt, "dd MMM yyyy 'às' HH:mm", { locale: pt })}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Informações do usuário */}
        {userDetails && (
          <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <Text className="font-semibold text-gray-800 mb-3">
              {isSupplier ? 'Informações do Cliente' : 'Informações do Fornecedor'}
            </Text>
            
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="person" size={20} color="#6b7280" className="mr-2" />
              <Text className="text-gray-700">{userDetails.name}</Text>
            </View>
            
            <View className="flex-row items-center mb-3">
              <MaterialIcons name="phone" size={20} color="#6b7280" className="mr-2" />
              <Text className="text-gray-700">{userDetails.phone || 'Não informado'}</Text>
            </View>
            
            <View className="flex-row items-center">
              <MaterialIcons name="location-on" size={20} color="#6b7280" className="mr-2" />
              <Text className="text-gray-700">{userDetails.address || 'Não informado'}</Text>
            </View>
          </View>
        )}

        {/* Detalhes do pedido */}
        <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
          <Text className="font-semibold text-gray-800 mb-3">Detalhes do Pedido</Text>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Quantidade:</Text>
            <Text className="font-medium">{order.quantity} litros</Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Preço por litro:</Text>
            <Text className="font-medium">{order.price && order.quantity 
              ? (order.price / order.quantity).toFixed(2) + ' Kz' 
              : 'N/A'}
            </Text>
          </View>
          
          <View className="flex-row justify-between mb-2">
            <Text className="text-gray-600">Total:</Text>
            <Text className="font-medium">{order.price?.toFixed(2)} Kz</Text>
          </View>
          
          <View className="mt-3 pt-3 border-t border-gray-100">
            <Text className="text-gray-600 mb-1">Endereço de entrega:</Text>
            <Text className="font-medium">{order.location.address}</Text>
          </View>
        </View>

        {/* Ações disponíveis */}
        {getStatusActions().length > 0 && (
          <View className="mt-4">
            <Text className="text-gray-600 mb-2">Ações disponíveis:</Text>
            <View className="flex-row flex-wrap">
              {getStatusActions().map((action, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={action.action}
                  disabled={actionLoading}
                  className={`px-4 py-2 rounded-full mr-2 mb-2 flex-row items-center ${action.color.split(' ')[0]}`}
                >
                  <MaterialIcons name={action.icon} size={18} color={action.color.split(' ')[1].split('-')[2]} />
                  <Text className={`ml-2 ${action.color.split(' ')[1]}`}>
                    {action.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default OrderDetailsScreen;