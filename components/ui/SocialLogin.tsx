import React from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export const SocialLogin = () => {
  const socialButtons = [
    { icon: 'google', color: '#DB4437', label: 'Google' },
    { icon: 'apple', color: '#000000', label: 'Apple' },
    { icon: 'facebook', color: '#4267B2', label: 'Facebook' },
  ];

  return (
    <View className="space-y-4">
      {socialButtons.map((button , index) => (
        <TouchableOpacity
          key={index}
          className="flex-row items-center justify-center border border-gray-300 rounded-lg p-3"
        >
          <MaterialCommunityIcons 
            name={button.icon as any} 
            size={24} 
            color={button.color} 
          />
          <Text className="ml-3">Continuar com {button.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};