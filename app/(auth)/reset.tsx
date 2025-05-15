// src/screens/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { ResetPasswordFormData } from '@/types/authSchemas';
import { ResetPasswordForm } from '@/components/screens/ResetPasswordForm';
import { useRouter } from 'expo-router';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '@/services/firebase';
import Toast from '@/components/ui/toast';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
    
  const showToast = (type: 'success' | 'error', message : string) => {
    setToast({visible: true, message, type });
  };
  const handleSubmit = async ({ email }: ResetPasswordFormData) => {
    try {
      setLoading(true);
      await sendPasswordResetEmail(auth, email)
      setSuccess(true);
    } catch (error) {
      showToast('error','Erro ao enviar código! Tente novamente')
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/(auth)');
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
        
          <ResetPasswordForm 
            onSubmit={handleSubmit}
            loading={loading}
            onBackToLogin={handleBackToLogin}
            success={success}
          />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ResetPasswordScreen;