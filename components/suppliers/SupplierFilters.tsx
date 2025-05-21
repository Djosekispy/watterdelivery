import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { GOOGLE_MAPS_API_KEY } from '@/config/google-maps-key';
import { View, TouchableOpacity, Text } from 'react-native';


// Adicione esta função de workaround antes do componente
function getRandomValuesPolyfill(buffer: Uint8Array) {
  const bytes = require('react-native-randombytes').randomBytes(buffer.length);
  buffer.set(bytes);
}

if (typeof global.crypto === 'undefined') {
  global.crypto = {
    getRandomValues: getRandomValuesPolyfill,
  } as Crypto;
}

interface SupplierFiltersProps {
  filters: {
    maxPrice: number | null;
    maxDistance: number | null;
    onlineOnly: boolean;
    searchAddress: string | null;
  };
  onFilterChange: (newFilters: {
    maxPrice?: number | null;
    maxDistance?: number | null;
    onlineOnly?: boolean;
    searchAddress?: string | null;
  }) => void;
  onAddressSelect: (address: string) => void;
}

const SupplierFilters = ({ filters, onFilterChange, onAddressSelect }: SupplierFiltersProps) => {
  return (
    <View className="bg-white shadow-sm p-3">
      <View className="mb-3">
        <GooglePlacesAutocomplete
          placeholder="Buscar por endereço"
          onPress={(data) => {
            onAddressSelect(data.description);
            onFilterChange({ searchAddress: data.description });
          }}
          query={{
            key: GOOGLE_MAPS_API_KEY,
            language: 'pt',
            components: 'country:ao',
          }}
          styles={{
            textInput: {
              height: 40,
              borderWidth: 1,
              borderColor: '#e5e7eb',
              borderRadius: 8,
              paddingHorizontal: 10,
            },
            listView: {
              position: 'absolute',
              top: 50,
              zIndex: 1000,
              elevation: 3,
              backgroundColor: 'white',
              width: '100%',
            },
          }}
          fetchDetails={true}
          enablePoweredByContainer={false}
          textInputProps={{
            autoCorrect: false,
          }}
        />
      </View>

      {/* Filtros rápidos */}
      <View className="flex-row justify-between">
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${filters.maxPrice === 110 ? 'bg-blue-600' : 'bg-gray-200'}`}
          onPress={() => onFilterChange({ maxPrice: filters.maxPrice === 110 ? null : 110 })}
        >
          <Text className={`text-sm font-medium ${filters.maxPrice === 110 ? 'text-white' : 'text-gray-700'}`}>
            ≤ 110 Kz
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${filters.maxDistance === 4 ? 'bg-blue-600' : 'bg-gray-200'}`}
          onPress={() => onFilterChange({ maxDistance: filters.maxDistance === 4 ? null : 4 })}
        >
          <Text className={`text-sm font-medium ${filters.maxDistance === 4 ? 'text-white' : 'text-gray-700'}`}>
            ≤ 4 km
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-4 py-2 rounded-full ${filters.onlineOnly ? 'bg-blue-600' : 'bg-gray-200'}`}
          onPress={() => onFilterChange({ onlineOnly: !filters.onlineOnly })}
        >
          <Text className={`text-sm font-medium ${filters.onlineOnly ? 'text-white' : 'text-gray-700'}`}>
            {filters.onlineOnly ? 'Todos' : 'Online'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SupplierFilters;