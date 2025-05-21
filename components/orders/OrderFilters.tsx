import { View, TouchableOpacity, Text } from 'react-native';
import { OrderStatus } from '@/types';
import { useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker';

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
    <View className="bg-white p-4 rounded-lg shadow-sm mb-4">
      {/* Filtro de Status */}
      <View className="mb-4">
        <View className="flex-row flex-wrap justify-center">
          {statusOptions.map((option) => (
            <TouchableOpacity
              key={option.value}
              onPress={() => {
                setSelectedStatus(option.value);
                onFilterChange({ status: option.value });
              }}
              className={`px-3 py-2 rounded-full mr-2 mb-2 ${
                selectedStatus === option.value ? 'bg-blue-600' : 'bg-gray-200'
              }`}
            >
              <Text
                className={`text-sm ${
                  selectedStatus === option.value ? 'text-white' : 'text-gray-700'
                }`}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Filtro de Data */}
      <View>
        <Text className="text-gray-600 mb-2">Período</Text>
        <View className="flex-row justify-between">
          <TouchableOpacity
            onPress={() => setShowDatePicker('start')}
            className="flex-1 mr-2 border border-gray-300 rounded-lg p-2"
          >
            <Text className="text-gray-700">
              {dateRange.start
                ? dateRange.start.toLocaleDateString('pt-AO')
                : 'Data inicial'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setShowDatePicker('end')}
            className="flex-1 ml-2 border border-gray-300 rounded-lg p-2"
          >
            <Text className="text-gray-700">
              {dateRange.end
                ? dateRange.end.toLocaleDateString('pt-AO')
                : 'Data final'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {showDatePicker && (
        <DateTimePicker
          value={showDatePicker === 'start' && dateRange.start 
            ? dateRange.start 
            : showDatePicker === 'end' && dateRange.end
            ? dateRange.end
            : new Date()}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

export default OrderFilters;