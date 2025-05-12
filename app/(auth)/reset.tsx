// src/screens/ResetPasswordScreen.tsx
import React, { useState } from 'react';
import { ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ResetPasswordFormData } from '@/types/authSchemas';
import { AuthTemplate } from '@/components/layout/AuthTemplate';
import { ResetPasswordForm } from '@/components/screens/ResetPasswordForm';
import { useRouter } from 'expo-router';

const ResetPasswordScreen = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async ({ email }: ResetPasswordFormData) => {
    try {
      setLoading(true);
      // Simular chamada à API
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    router.push('/(auth)/login');
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