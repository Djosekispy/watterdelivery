import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, Keyboard } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
  const [addressInput, setAddressInput] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  const handleSearch = () => {
    if (addressInput.trim()) {
      onAddressSelect(addressInput);
      onFilterChange({ searchAddress: addressInput });
      Keyboard.dismiss();
    }
  };

  const clearSearch = () => {
    setAddressInput('');
    onFilterChange({ searchAddress: null });
  };

  return (
    <View className="bg-white shadow-sm p-4 rounded-xl space-y-4">
      {/* Campo de busca manual */}
      <View className={`mb-4 border rounded-lg ${isSearchFocused ? 'border-blue-500' : 'border-gray-300'}`}>
        <View className="flex-row items-center px-3 py-2">
          <MaterialIcons name="search" size={24} color="#6b7280" />
          <TextInput
            className="flex-1 ml-2 text-gray-700"
            placeholder="Digite um endereço (ex: Rua Comercial, Luanda)"
            value={addressInput}
            onChangeText={setAddressInput}
            onSubmitEditing={handleSearch}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            returnKeyType="search"
          />
          {addressInput ? (
            <TouchableOpacity onPress={clearSearch}>
              <MaterialIcons name="close" size={20} color="#6b7280" />
            </TouchableOpacity>
          ) : null}
        </View>
        
        <TouchableOpacity
          onPress={handleSearch}
          className="bg-blue-600 py-2 rounded-b-lg items-center"
          disabled={!addressInput.trim()}
        >
          <Text className="text-white font-medium">Buscar Endereço</Text>
        </TouchableOpacity>
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