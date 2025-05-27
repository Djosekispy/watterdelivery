import React from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Text, TouchableOpacity, View } from 'react-native';
import { FormInput } from '../layout/FormInput';
import { Button } from '../ui/Button';

const schema = yup.object().shape({
  email: yup.string().email('E-mail inválido').required('E-mail é obrigatório'),
  password: yup.string().min(6, 'Senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
});

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => void;
  loading?: boolean;
  onForgotPassword?: () => void;
  email?: string;
  password?: string;
}

export const LoginForm = ({ onSubmit, loading, onForgotPassword, email, password }: LoginFormProps) => {
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      email: email || '',
      password: password || '',
    },
  });

  return (
    <View className="w-full">
      <FormInput
        control={control}
        name="email"
        placeholder="E-mail"
        icon="email-outline"
      />
      <FormInput
        control={control}
        name="password"
        placeholder="Senha"
        secureTextEntry
        icon="lock-outline"
      />
      
      <TouchableOpacity onPress={onForgotPassword} className="self-end mb-6">
        <Text className="text-blue-600">Esqueceu sua senha?</Text>
      </TouchableOpacity>
      
      <Button 
        title="Entrar" 
        onPress={handleSubmit(onSubmit)} 
        loading={loading} 
      />
    </View>
  );
};