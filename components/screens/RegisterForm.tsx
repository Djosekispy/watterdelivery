import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View, TouchableOpacity, Text } from 'react-native';
import { RegisterFormData, registerSchema } from '@/types/authSchemas';
import { FormInput } from '../layout/FormInput';
import { Button } from '../ui/Button';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => void;
  loading?: boolean;
  onLoginPress?: () => void;
}

export const RegisterForm = ({ onSubmit, loading, onLoginPress }: RegisterFormProps) => {
  const { 
    control, 
    handleSubmit 
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  return (
    <View style={{ width: '100%' }}>
      <FormInput
        control={control}
        name="name"
        placeholder="Nome completo"
        icon="account-outline"
      />
      
      <FormInput
        control={control}
        name="email"
        placeholder="E-mail"
        icon="email-outline"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <FormInput
        control={control}
        name="password"
        placeholder="Senha"
        secureTextEntry
        icon="lock-outline"
      />
      
      <FormInput
        control={control}
        name="confirmPassword"
        placeholder="Confirmar senha"
        secureTextEntry
        icon="lock-check-outline"
      />
      
      <View style={{ marginTop: 16 }}>
        <Button 
          title="Cadastrar" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading} 
        />
      </View>
      
      <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 24 }}>
        <Text style={{ color: '#4B5563' }}>Já tem uma conta?</Text>
        <TouchableOpacity onPress={onLoginPress} style={{ marginLeft: 4 }}>
          <Text style={{ color: '#2563EB', fontWeight: '600' }}>Faça login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
