import { useState, useEffect } from 'react';
import { View, SafeAreaView, Text, TouchableOpacity } from 'react-native';
import * as Location from 'expo-location';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { getDistance} from 'geolib';
import { Supplier } from '@/types';
import SupplierFilters from '@/components/suppliers/SupplierFilters';
import SupplierList from '@/components/suppliers/SupplierList';
import SupplierDetailsModal from '@/components/suppliers/SupplierDetailsModal';
import OrderFormModal from '@/components/suppliers/OrderFormModal';
import { Order } from '@/types';
import { GOOGLE_MAPS_API_KEY } from '@/config/google-maps-key';
import { db } from '@/services/firebase';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const SupplierListScreen = () => {
  const navigate = useRouter()
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [searchLocation, setSearchLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showOrderForm, setShowOrderForm] = useState(false);
  
  const [filters, setFilters] = useState({
    maxPrice: null as number | null,
    maxDistance: null as number | null,
    onlineOnly: false,
    searchAddress: null as string | null,
  });

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permissão de localização negada');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
      setSearchLocation({
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      });
    })();
  }, []);

  useEffect(() => {
    if (searchLocation) {
      fetchSuppliers();
    }
  }, [searchLocation]);

  useEffect(() => {
    applyFilters();
  }, [filters, suppliers]);

  const fetchSuppliers = async () => {
    try {
      const q = query(collection(db, 'users'), where('userType', '==', 'supplier'));
      const querySnapshot = await getDocs(q);
      const supplierList: Supplier[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data() as Supplier;
        if (data.location && searchLocation) {
          const distance = getDistance(
            { latitude: searchLocation.lat, longitude: searchLocation.lng },
            { latitude: data.location.lat, longitude: data.location.lng }
          ) / 1000;
          data.distanceKm = distance;
        } else {
          data.distanceKm = null;
        }
        supplierList.push(data);
      });

      if (supplierList.length === 0) {
        const mockSuppliers: Supplier[] = [
          {
            id: '1',
            name: 'Fornecedor A',
            photo: '',
            password: '',
            email: 'fornecedorA@example.com',
            userType: 'supplier',
            createdAt: new Date(),
            location: { lat: -8.8383, lng: 13.2344 },
            phone: '912345678',
            online: true,
            address: 'Rua A, Luanda',
            pricePerLiter: 100,
            distanceKm: 5,
          },
          {
            id: '2',
            name: 'Fornecedor B',
            photo: '',
            password: '',
            email: 'fornecedorB@example.com',
            userType: 'supplier',
            createdAt: new Date(),
            location: { lat: -8.8390, lng: 13.2350 },
            phone: '923456789',
            online: false,
            address: 'Rua B, Luanda',
            pricePerLiter: 120,
            distanceKm: 3,
          },
        ];
        setSuppliers(mockSuppliers);
        setFilteredSuppliers(mockSuppliers);
      } else {
        setSuppliers(supplierList);
        setFilteredSuppliers(supplierList);
      }
    } catch (error) {
      console.error('Erro ao buscar fornecedores:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...suppliers];

    if (filters.maxPrice !== null) {
      filtered = filtered.filter((supplier) => supplier.pricePerLiter <= filters.maxPrice!);
    }

    if (filters.maxDistance !== null) {
      filtered = filtered.filter((supplier) => supplier.distanceKm !== null && supplier.distanceKm <= filters.maxDistance!);
    }

    if (filters.onlineOnly) {
      filtered = filtered.filter((supplier) => supplier.online);
    }

    if (filters.searchAddress) {
      filtered = filtered.filter((supplier) => 
        supplier.address?.toLowerCase().includes(filters.searchAddress!.toLowerCase())
      );
    }

    setFilteredSuppliers(filtered);
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  };

  const handleAddressSelect = async (address: string) => {
    try {
      // Geocodificar o endereço selecionado para obter coordenadas
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${GOOGLE_MAPS_API_KEY}`
      );
      const json = await response.json();
      
      if (json.results && json.results.length > 0) {
        const location = json.results[0].geometry.location;
        setSearchLocation({
          lat: location.lat,
          lng: location.lng,
        });
      }
    } catch (error) {
      console.error('Erro ao geocodificar endereço:', error);
    }
  };

  const handleSupplierPress = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
    setShowDetailsModal(true);
  };

  const handleOrderPress = () => {
    setShowDetailsModal(false);
    setShowOrderForm(true);
  };

  const handleSubmitOrder = (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
    console.log('Pedido enviado:', order);
    setShowOrderForm(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 pt-6">
      <View className="flex-1">
      <View className="flex-row items-center justify-between px-6 py-4  ">
  <TouchableOpacity 
    onPress={() => navigate.back()}
    className="p-2 rounded-full bg-gray-100 active:bg-gray-200"
  >
    <MaterialCommunityIcons 
      name="arrow-left" 
      color="#4b5563" 
      size={26} 
    />
  </TouchableOpacity>
  
  <Text className="text-xl font-bold text-gray-800 flex-1 text-center mx-4">
    Encontre um fornecedor 
  </Text>
  <View className="w-8" />
</View>
        <SupplierFilters 
          filters={filters} 
          onFilterChange={handleFilterChange}
          onAddressSelect={handleAddressSelect}
        />
        <SupplierList 
          suppliers={filteredSuppliers} 
          loading={loading} 
          onSupplierPress={handleSupplierPress} 
        />
      </View>

      <SupplierDetailsModal
        visible={showDetailsModal}
        supplier={selectedSupplier}
        onClose={() => setShowDetailsModal(false)}
        onOrderPress={handleOrderPress}
      />

      <OrderFormModal
        visible={showOrderForm}
        supplier={selectedSupplier}
        onClose={() => setShowOrderForm(false)}
        onSubmit={handleSubmitOrder}
        userLocation={userLocation}
      />
    </SafeAreaView>
  );
};

export default SupplierListScreen;