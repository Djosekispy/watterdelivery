import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Supplier } from '../../types';

interface SupplierCardProps {
  supplier: Supplier;
  onPress: () => void;
}

const SupplierCard = ({ supplier, onPress }: SupplierCardProps) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <View className="flex-row bg-white rounded-lg shadow-md mb-3 overflow-hidden">
        <Image 
          source={{ uri: supplier.photo || 'https://via.placeholder.com/150' }} 
          className="w-24 h-24 rounded-l-lg"
          resizeMode="cover"
        />
        <View className="flex-1 p-3 justify-between">
          <View>
            <Text className="text-lg font-bold text-gray-800">{supplier.name}</Text>
            <Text className="text-sm text-gray-600">{supplier.address}</Text>
          </View>
          <View className="flex-row justify-between items-center mt-2">
            <View>
              <Text className="text-sm font-medium text-gray-700">{supplier.pricePerLiter} Kz/L</Text>
              <Text className="text-sm text-gray-500">
                {supplier.distanceKm ? `${supplier.distanceKm.toFixed(1)} km` : 'N/A'}
              </Text>
            </View>
            <View className={`px-2 py-1 rounded-full ${supplier.online ? 'bg-green-100' : 'bg-red-100'}`}>
              <Text className={`text-xs font-semibold ${supplier.online ? 'text-green-800' : 'text-red-800'}`}>
                {supplier.online ? 'ONLINE' : 'OFFLINE'}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default SupplierCard;