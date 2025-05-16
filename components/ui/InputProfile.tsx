import React from 'react';
import { TextInput, View, Text } from 'react-native';

interface InputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  editable?: boolean;
}

export const InputProfile: React.FC<InputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  editable = true
}) => (
  <View className="mb-4">
    <Text className="text-sm font-semibold text-gray-700 mb-1">{label}</Text>
    <TextInput
      className={`border border-gray-300 rounded-xl px-4 py-3 bg-white text-gray-800", ${!editable} && "bg-gray-100`}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      secureTextEntry={secureTextEntry}
      editable={editable}
    />
  </View>
);
