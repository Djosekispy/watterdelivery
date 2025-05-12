// src/components/organisms/ResetPasswordForm/ResetPasswordForm.tsx
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { View, TouchableOpacity, Image } from 'react-native';
import { Button } from '../../atoms/Button';
import { FormInput } from '../../molecules/FormInput';
import { Text } from '../../atoms/Text';
import { resetPasswordSchema, ResetPasswordFormData } from '../../../validations/authSchemas';
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface ResetPasswordFormProps {
  onSubmit: (data: ResetPasswordFormData) => void;
  loading?: boolean;
  onBackToLogin?: () => void;
  success?: boolean;
}

export const ResetPasswordForm = ({ 
  onSubmit, 
  loading, 
  onBackToLogin,
  success = false
}: ResetPasswordFormProps) => {
  const { 
    control, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(resetPasswordSchema),
  });

  if (success) {
    return (
      <View className="items-center justify-center p-6">
        <View className="bg-green-100 p-4 rounded-full mb-6">
          <MaterialCommunityIcons name="check-circle" size={48} color="#10B981" />
        </View>
        
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          E-mail enviado!
        </Text>
        
        <Text className="text-gray-600 text-center mb-8">
          Enviamos um link para redefinir sua senha para o e-mail informado.
          Verifique sua caixa de entrada.
        </Text>
        
        <Button 
          title="Voltar para login" 
          onPress={onBackToLogin}
          variant="outline"
          className="w-full"
        />
      </View>
    );
  }

  return (
    <View className="w-full">
      <View className="items-center mb-8">
        <Image 
          source={require('../../../assets/images/reset-password.png')} 
          className="w-48 h-48 mb-4"
        />
        <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
          Redefinir senha
        </Text>
        <Text className="text-gray-600 text-center">
          Digite seu e-mail para receber o link de redefinição
        </Text>
      </View>
      
      <FormInput
        control={control}
        name="email"
        placeholder="Seu e-mail cadastrado"
        icon="email-outline"
        keyboardType="email-address"
        autoCapitalize="none"
      />
      
      <View className="mt-6">
        <Button 
          title="Enviar link" 
          onPress={handleSubmit(onSubmit)} 
          loading={loading}
          icon="send"
        />
      </View>
      
      <TouchableOpacity 
        onPress={onBackToLogin} 
        className="flex-row items-center justify-center mt-6"
      >
        <MaterialCommunityIcons 
          name="arrow-left" 
          size={20} 
          color="#3B82F6" 
        />
        <Text className="text-blue-600 ml-2">Voltar para login</Text>
      </TouchableOpacity>
    </View>
  );
};