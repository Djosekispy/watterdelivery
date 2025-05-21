import { FlatList, View, ActivityIndicator, Text } from 'react-native';
import SupplierCard from './SupplierCard';
import { Supplier } from '@/types';

interface SupplierListProps {
  suppliers: Supplier[];
  loading: boolean;
  onSupplierPress: (supplier: Supplier) => void;
}

const SupplierList = ({ suppliers, loading, onSupplierPress }: SupplierListProps) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text className="mt-4 text-gray-600">Carregando fornecedores...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={suppliers}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <SupplierCard supplier={item} onPress={() => onSupplierPress(item)} />
      )}
      contentContainerStyle={{ padding: 12 }}
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center mt-10">
          <Text className="text-gray-500">Nenhum fornecedor encontrado</Text>
        </View>
      }
    />
  );
};

export default SupplierList;