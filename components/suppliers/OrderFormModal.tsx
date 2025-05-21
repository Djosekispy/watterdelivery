import { View, Text, Modal, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState } from 'react';
import { Order, OrderStatus, Supplier } from '../../types';

interface OrderFormModalProps {
  visible: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onSubmit: (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => void;
  userLocation: { lat: number; lng: number } | null;
}

const OrderFormModal = ({ visible, supplier, onClose, onSubmit, userLocation }: OrderFormModalProps) => {
  const [quantity, setQuantity] = useState('');
  const [address, setAddress] = useState('');

  const handleSubmit = () => {
    if (!supplier || !userLocation) return;

    const quantityNumber = parseFloat(quantity);
    if (isNaN(quantityNumber)) {
      Alert.alert('Erro', 'Por favor, insira uma quantidade válida');
      return;
    }

    if (!address.trim()) {
      Alert.alert('Erro', 'Por favor, insira um endereço');
      return;
    }

    onSubmit({
      consumerId: 'current-user-id', 
      supplierId: supplier.id,
      quantity: quantityNumber,
      status: 'pending' as OrderStatus,
      location: {
        address,
        lat: userLocation.lat,
        lng: userLocation.lng,
      },
      price: quantityNumber * supplier.pricePerLiter,
    });

    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center bg-black bg-opacity-50 p-4">
        <View className="bg-white rounded-lg p-6">
          <Text className="text-xl font-bold mb-4">Novo Pedido</Text>
          
          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Quantidade (litros)</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              keyboardType="numeric"
              value={quantity}
              onChangeText={setQuantity}
              placeholder="Ex: 20"
            />
          </View>

          <View className="mb-4">
            <Text className="text-gray-600 mb-1">Endereço de entrega</Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-3"
              value={address}
              onChangeText={setAddress}
              placeholder="Digite o endereço completo"
              multiline
            />
          </View>

          {supplier && (
            <View className="mb-4 p-3 bg-gray-50 rounded-lg">
              <Text className="font-medium">Total estimado:</Text>
              <Text className="text-lg">
                {(parseFloat(quantity) || 0 * supplier.pricePerLiter).toFixed(2)} Kz
              </Text>
            </View>
          )}

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-gray-700">Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              className="px-4 py-2 bg-blue-600 rounded-lg"
            >
              <Text className="text-white">Confirmar Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default OrderFormModal;