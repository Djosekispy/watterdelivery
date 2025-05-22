import { View, Text, Image, Modal, TouchableOpacity, Linking } from 'react-native';
import { MaterialIcons, FontAwesome } from '@expo/vector-icons';
import { Supplier } from '../../types';
import { useAuth } from '@/context/AuthContext';

interface SupplierDetailsModalProps {
  visible: boolean;
  supplier: Supplier | null;
  onClose: () => void;
  onOrderPress: () => void;
}

const SupplierDetailsModal = ({ visible, supplier, onClose, onOrderPress }: SupplierDetailsModalProps) => {
  const {user } = useAuth()
  if (!supplier) return null;

  const handleCall = () => {
    Linking.openURL(`tel:${supplier.phone}`);
  };

  const handleWhatsApp = () => {
    Linking.openURL(`https://wa.me/${supplier.phone}?text=Olá ${supplier.name}, gostaria de fazer um pedido`);
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
          <View className="flex-row items-center mb-4">
            <Image
              source={{ uri: supplier.photo || 'https://via.placeholder.com/150' }}
              className="w-20 h-20 rounded-full mr-4"
            />
            <View>
              <Text className="text-xl font-bold">{supplier.name}</Text>
              <Text className="text-gray-600">{supplier.address}</Text>
            </View>
          </View>

          <View className="mb-4">
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600">Preço por litro</Text>
              <Text className="font-medium">{supplier.pricePerLiter} Kz/L</Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600">Distância</Text>
              <Text className="font-medium">
                {supplier.distanceKm ? `${supplier.distanceKm.toFixed(1)} km` : 'N/A'}
              </Text>
            </View>
            <View className="flex-row justify-between py-2 border-b border-gray-100">
              <Text className="text-gray-600">Status</Text>
              <Text className={`font-medium ${supplier.online ? 'text-green-600' : 'text-red-600'}`}>
                {supplier.online ? 'Online' : 'Offline'}
              </Text>
            </View>
            <View className="flex-row justify-between py-2">
              <Text className="text-gray-600">Telefone</Text>
              <View className="flex-row items-center">
                <Text className="font-medium mr-3">{supplier.phone}</Text>
                <TouchableOpacity onPress={handleWhatsApp} className="mr-3">
                  <FontAwesome name="whatsapp" size={24} color="#25D366" />
                </TouchableOpacity>
                <TouchableOpacity onPress={handleCall}>
                  <MaterialIcons name="call" size={24} color="#3b82f6" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View className="flex-row justify-between mt-4">
            <TouchableOpacity
              onPress={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            >
              <Text className="text-gray-700">Fechar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onOrderPress}
              className="px-4 py-2 bg-blue-600 rounded-lg"
              disabled={!(supplier.id === user?.id) || !supplier.online}
            >
              <Text className="text-white">Fazer Pedido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default SupplierDetailsModal;