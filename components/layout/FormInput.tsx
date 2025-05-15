import React, { useState } from 'react';
import { TextInputProps, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useController } from 'react-hook-form';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface FormInputProps extends TextInputProps {
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
  ...rest
}: FormInputProps) => {
  const { field, fieldState } = useController({ control, name });
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = secureTextEntry;
  const toggleVisibility = () => setShowPassword((prev) => !prev);

  return (
    <View style={styles.container}>
      <View style={[
        styles.inputWrapper,
        fieldState.error ? styles.errorBorder : styles.normalBorder
      ]}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={20}
            color="#6B7280"
            style={styles.leftIcon}
          />
        )}
        <TextInput
          value={field.value}
          onChangeText={field.onChange}
          placeholder={placeholder}
          placeholderTextColor="#9CA3AF"
          secureTextEntry={isPassword && !showPassword}
          style={styles.input}
          {...rest}
        />
        {isPassword && (
          <TouchableOpacity onPress={toggleVisibility} style={styles.rightIcon}>
            <MaterialCommunityIcons
              name={showPassword ? 'eye-off' : 'eye'}
              size={20}
              color="#6B7280"
            />
          </TouchableOpacity>
        )}
      </View>
      {fieldState.error && (
        <Text style={styles.errorText}>{fieldState.error.message}</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
    width: '100%',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#F3F4F6',
  },
  normalBorder: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: '#DC2626',
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    color: '#111827',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
