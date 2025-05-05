import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Logo from '@/components/Logo';
import { useRouter } from 'expo-router';

const Footer = () => {
  const router = useRouter();
  const goNext = (route: any) => {
    router.replace(route);
  }
  return (
    <View className="bg-gray-50 border-t border-gray-200 mt-auto">
      <View className="container mx-auto px-4 py-8">
        <View className="flex flex-col md:flex-row justify-between items-center mb-6">
          <Logo vertical size="sm" />
          <View className="mt-4 md:mt-0">
            <View className="flex flex-row space-x-6">
              <TouchableOpacity onPress={() => goNext('Home')}>
                <Text className="text-gray-600 hover:text-agua-600">Início</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => goNext('About')}>
                <Text className="text-gray-600 hover:text-agua-600">Sobre</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => goNext('Contact')}>
                <Text className="text-gray-600 hover:text-agua-600">Contato</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View className="border-t border-gray-200 pt-6">
          <Text className="text-center text-sm text-gray-500">
            &copy; {new Date().getFullYear()} ÁguaExpressa. Todos os direitos reservados.
          </Text>
        </View>
      </View>
    </View>
  );
};

export default Footer;