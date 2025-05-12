import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  error?: string;
  secureTextEntry?: boolean;
  icon?: React.ReactNode;
}

export const Input = ({
  value,
  onChangeText,
  placeholder,
  error,
  secureTextEntry = false,
  icon,
}: InputProps) => {
  return (
    <View className="mb-4">
      <View className={`flex-row items-center border rounded-lg px-4 ${error ? 'border-red-500' : 'border-gray-300'}`}>
        {icon && <View className="mr-3">{icon}</View>}
        <TextInput
          className="flex-1 py-3 text-gray-800"
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={secureTextEntry}
        />
      </View>
      {error && <Text className="text-red-500 text-xs mt-1">{error}</Text>}
    </View>
  );
};