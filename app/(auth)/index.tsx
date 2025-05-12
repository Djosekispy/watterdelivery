import React, { useState } from 'react';
import { View, ScrollView, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import { AuthTemplate } from '@/components/layout/AuthTemplate';
import { LoginForm } from '@/components/screens/LoginForm';
import { SocialLogin } from '@/components/ui/SocialLogin';

const LoginScreen = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogin = async ({ email, password }: { email: string; password: string }) => {
    try {
      setLoading(true);
      await login(email, password);
    } catch (error) {
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = () => {
    // Navegar para tela de recuperação de senha
  };

  const handleSignUp = () => {
    // Navegar para tela de cadastro
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <AuthTemplate
          title="Bem-vindo de volta"
          subtitle="Faça login para continuar"
          footerText="Não tem uma conta?"
          footerActionText="Cadastre-se"
          footerAction={handleSignUp}
        >
          <LoginForm 
            onSubmit={handleLogin} 
            loading={loading}
            onForgotPassword={handleForgotPassword}
          />
          
          <View className="my-6 flex-row items-center">
            <View className="flex-1 h-px bg-gray-300" />
            <Text className="px-4 text-gray-500">ou</Text>
            <View className="flex-1 h-px bg-gray-300" />
          </View>
          
        </AuthTemplate>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default LoginScreen;