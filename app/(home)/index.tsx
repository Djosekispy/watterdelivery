import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import MainLayout from '@/components/layout/MainLayout';
import { Droplets, Truck, Clock, MapPin } from 'lucide-react-native';
import Logo from '@/components/Logo';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';

const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter()
 const goNext = (route: any) => {
    router.replace(route)
    }
  return (
    <MainLayout>
      <ScrollView className="flex-1">
        {/* Hero Section */}
        <View className="pt-12 pb-20 bg-gradient-to-b from-white to-blue-50">
          <View className="container px-4 mx-auto">
            <View className="flex flex-col md:flex-row items-center">
              <View className="md:w-1/2 mb-10 md:mb-0">
                <Text className="text-4xl md:text-5xl font-bold mb-4 text-gray-900">
                  Entrega de água <Text className="text-agua-600">rápida</Text> e <Text className="text-agua-600">confiável</Text>
                </Text>
                <Text className="text-xl text-gray-600 mb-8 max-w-lg">
                  Conectamos você com fornecedores de água próximos para entregas rápidas e fáceis.
                </Text>
                <View className="flex-row space-x-4">
                  {!user ? (
                    <>
                      <Button 
                        className="agua-button-primary text-lg px-6 py-6"
                        onPress={() => goNext('Register')}
                      >
                        <Text>Cadastre-se Agora</Text>
                      </Button>
                      <Button 
                        variant="outline" 
                        className="agua-button-outline text-lg px-6 py-6"
                        onPress={() => goNext('Login')}
                      >
                        <Text>Entrar</Text>
                      </Button>
                    </>
                  ) : user.userType === 'consumer' ? (
                    <Button 
                      className="agua-button-primary text-lg px-6 py-6"
                      onPress={() => goNext('NewOrder')}
                    >
                      <Text>Solicitar Água Agora</Text>
                    </Button>
                  ) : (
                    <Button 
                      className="agua-button-primary text-lg px-6 py-6"
                      onPress={() => goNext('Orders')}
                    >
                      <Text>Ver Pedidos Disponíveis</Text>
                    </Button>
                  )}
                </View>
              </View>
              <View className="md:w-1/2 flex justify-center">
                <View className="relative">
                  <View className="w-72 h-72 rounded-full bg-blue-100 items-center justify-center">
                    <Logo size="lg" />
                  </View>
                  <View className="absolute top-0 left-0 w-full h-full">
                    <View className="absolute top-10 right-8 w-16 h-16 bg-blue-200 rounded-full opacity-50"></View>
                    <View className="absolute bottom-10 left-8 w-10 h-10 bg-blue-300 rounded-full opacity-50"></View>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Features Section */}
        <View className="py-16 bg-white">
          <View className="container px-4 mx-auto">
            <Text className="text-3xl font-bold text-center mb-12">Como Funciona</Text>
            <View className="flex flex-col md:flex-row gap-8">
              <View className="items-center px-4">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <MapPin size={32} color="#3b82f6" />
                </View>
                <Text className="text-xl font-semibold mb-2">Informe sua Localização</Text>
                <Text className="text-gray-600 text-center">
                  Compartilhe sua localização para encontrarmos os fornecedores mais próximos de você.
                </Text>
              </View>
              <View className="items-center px-4">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <Droplets size={32} color="#3b82f6" />
                </View>
                <Text className="text-xl font-semibold mb-2">Faça seu Pedido</Text>
                <Text className="text-gray-600 text-center">
                  Selecione a quantidade de água que você precisa e um fornecedor próximo.
                </Text>
              </View>
              <View className="items-center px-4">
                <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center mb-4">
                  <Truck size={32} color="#3b82f6" />
                </View>
                <Text className="text-xl font-semibold mb-2">Receba sua Entrega</Text>
                <Text className="text-gray-600 text-center">
                  Acompanhe o fornecedor em tempo real até a entrega do seu pedido.
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* CTA Section */}
        <View className="py-16 bg-agua-600">
          <View className="container px-4 mx-auto items-center">
            <Text className="text-3xl font-bold mb-4 text-white">Pronto para Começar?</Text>
            <Text className="text-xl mb-8 max-w-2xl text-white text-center">
              Registro rápido e fácil para consumidores e fornecedores de água. Comece a usar agora mesmo!
            </Text>
            <Button 
              variant="secondary" 
              size="lg"
              onPress={() => goNext(user ? 'Orders' : 'Register')}
              className="bg-white text-agua-600 text-lg px-8 py-6"
            >
              <Text>{user ? 'Ver Meus Pedidos' : 'Cadastre-se Gratuitamente'}</Text>
            </Button>
          </View>
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default HomeScreen;