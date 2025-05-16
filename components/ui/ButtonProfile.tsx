import React from 'react';
import { TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
}

export const ButtonProfile: React.FC<ButtonProps> = ({
  label,
  onPress,
  variant = 'primary'
}) => {
  const baseStyles = 'rounded-xl px-4 py-3 items-center';
  const variantStyles = variant === 'primary'
    ? 'bg-blue-600'
    : 'bg-gray-300';

  return (
    <TouchableOpacity onPress={onPress} className={`${baseStyles} ${variantStyles}`}>
      <Text className="text-white font-semibold">{label}</Text>
    </TouchableOpacity>
  );
};
