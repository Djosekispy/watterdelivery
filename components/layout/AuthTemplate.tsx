import React from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import logo from '@/assets/images/log.png'

interface AuthTemplateProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  footerText?: string;
  footerAction?: () => void;
  footerActionText?: string;
}

export const AuthTemplate = ({ 
  title, 
  subtitle, 
  children, 
  footerText, 
  footerAction, 
  footerActionText 
}: AuthTemplateProps) => {
  return (
    <View className="flex-1 bg-white px-6 justify-center">
      <View className="items-center mb-10">
        <Image 
          source={logo} 
          className="w-32 h-32 mb-6"
        />
        <Text className="text-3xl font-bold text-gray-900 mb-2">{title}</Text>
        {subtitle && <Text className="text-gray-600">{subtitle}</Text>}
      </View>
      
      {children}
      
      {footerText && (
        <View className="flex-row justify-center mt-8">
          <Text className="text-gray-600">{footerText}</Text>
          <TouchableOpacity onPress={footerAction}>
            <Text className="text-blue-600 ml-1">{footerActionText}</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};