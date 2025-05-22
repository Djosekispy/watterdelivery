import { View, TouchableOpacity, Text } from 'react-native';
import { OrderStatus } from '@/types';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';
import { FlatList } from 'react-native';


interface OrderFiltersProps {
  onFilterChange: (filters: {
    status?: OrderStatus | 'all';
    startDate?: Date | null;
    endDate?: Date | null;
  }) => void;
}

const statusOptions: { value: OrderStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'Todos' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'accepted', label: 'Aceitos' },
  { value: 'in_transit', label: 'Em transporte' },
  { value: 'delivered', label: 'Entregues' },
  { value: 'canceled', label: 'Cancelados' },
];

const OrderFilters = ({ onFilterChange }: OrderFiltersProps) => {
  const [selectedStatus, setSelectedStatus] = useState<OrderStatus | 'all'>('all');
  const [showDatePicker, setShowDatePicker] = useState<'start' | 'end' | null>(null);
  const [dateRange, setDateRange] = useState<{
    start: Date | null;
    end: Date | null;
  }>({ start: null, end: null });

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(null);
    if (selectedDate) {
      const newDateRange = { ...dateRange };
      if (showDatePicker === 'start') {
        newDateRange.start = selectedDate;
      } else {
        newDateRange.end = selectedDate;
      }
      setDateRange(newDateRange);
      onFilterChange({
        startDate: newDateRange.start,
        endDate: newDateRange.end,
      });
    }
  };

  return (
  
    <View className="bg-white p-5 rounded-2xl shadow-md mb-6">
      {/* Filtro de Status */}
      <View className="mb-6">
        <Text className="text-gray-500 text-sm font-semibold mb-3">Status</Text>
        <FlatList
          data={statusOptions}
          keyExtractor={(item) => item.value}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                setSelectedStatus(item.value);
                onFilterChange({ status: item.value });
              }}
              className={`px-4 py-2 rounded-full border mr-2 ${
                selectedStatus === item.value
                  ? 'bg-blue-600 border-blue-600'
                  : 'bg-gray-100 border-gray-300'
              }`}
            >
              <Text
                className={`text-sm font-medium ${
                  selectedStatus === item.value ? 'text-white' : 'text-gray-700'
                }`}
              >
                {item.label}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    
      {/* Filtro de Data */}
      <View>
        <Text className="text-gray-500 text-sm font-semibold mb-2">Período</Text>
        <View className="flex-row justify-between gap-3">
          <TouchableOpacity
            onPress={() => setShowDatePicker('start')}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl p-3"
          >
            <Text className="text-gray-700 text-sm">
              {dateRange.start
                ? dateRange.start.toLocaleDateString('pt-AO')
                : 'Data inicial'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDatePicker('end')}
            className="flex-1 bg-gray-50 border border-gray-300 rounded-xl p-3"
          >
            <Text className="text-gray-700 text-sm">
              {dateRange.end
                ? dateRange.end.toLocaleDateString('pt-AO')
                : 'Data final'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    
      {showDatePicker && (
        <DateTimePicker
          value={
            showDatePicker === 'start' && dateRange.start
              ? dateRange.start
              : showDatePicker === 'end' && dateRange.end
              ? dateRange.end
              : new Date()
          }
          mode="date"
          display="calendar"
          onChange={handleDateChange}
        />
      )}
    </View>
    
  
  );
};

export default OrderFilters;