import React from 'react';
import { useController } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Input } from '../ui/Input';

interface FormInputProps {
  control: any;
  name: string;
  placeholder: string;
  secureTextEntry?: boolean;
  icon?: keyof typeof MaterialCommunityIcons.glyphMap;
}

export const FormInput = ({
  control,
  name,
  placeholder,
  secureTextEntry = false,
  icon,
}: FormInputProps) => {
  const { field, fieldState } = useController({
    control,
    name,
  });

  const IconComponent = icon ? (
    <MaterialCommunityIcons name={icon} size={20} color="#6B7280" />
  ) : null;

  return (
    <Input
      value={field.value}
      onChangeText={field.onChange}
      placeholder={placeholder}
      error={fieldState.error?.message}
      secureTextEntry={secureTextEntry}
      icon={IconComponent}
    />
  );
};