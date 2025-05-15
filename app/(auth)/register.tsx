import { AuthTemplate } from '@/components/layout/AuthTemplate';
import { RegisterForm } from '@/components/screens/RegisterForm';
import Toast from '@/components/ui/toast';
import { useAuth } from '@/context/AuthContext';
import { RegisterFormData } from '@/types/authSchemas';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform, View, Text } from 'react-native';


const RegisterScreen = () => {
  const { register , login} = useAuth();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
    
  const showToast = (type: 'success' | 'error', message : string) => {
    setToast({visible: true, message, type });
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setLoading(true);
      await register(data,data.password);
      await login(data.email, data.password)
    } catch (error) {
      showToast('error','Erro ao cadastrar! Tente outros dados')
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    // Navegar para tela de login
     router.push('/(auth)/');
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
           <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
        <AuthTemplate
          title="Crie sua conta"
          subtitle="Preencha os dados para se cadastrar"
        >
          <RegisterForm 
            onSubmit={handleRegister} 
            loading={loading}
            onLoginPress={handleLogin}
          />
          
      
        </AuthTemplate>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default RegisterScreen;