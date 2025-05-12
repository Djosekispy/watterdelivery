import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'outline';
}

export const Button = ({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'primary' 
}: ButtonProps) => {
  const variants = {
    primary: 'bg-blue-600',
    secondary: 'bg-purple-600',
    outline: 'bg-transparent border border-blue-600',
  };

  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-blue-600',
  };

  return (
    <TouchableOpacity
      className={`${variants[variant]} rounded-lg p-4 items-center justify-center min-h-[56px]`}
      onPress={onPress}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === 'outline' ? '#2563EB' : '#FFF'} />
      ) : (
        <Text className={`${textColors[variant]} font-semibold text-lg`}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};