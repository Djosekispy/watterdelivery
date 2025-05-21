import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  Button,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { getAuth } from 'firebase/auth';
import { useRouter } from 'expo-router';

import { ProfileHeader } from '@/components/layout/ProfileHeader';
import { ButtonProfile } from '@/components/ui/ButtonProfile';
import { InputProfile } from '@/components/ui/InputProfile';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';

const ProfileScreen = () => {
  const navigation = useRouter();
  const { user, updatedUser } = useAuth();
  const userData = getAuth().currentUser;
  const [userState, setUser] = useState<User>(user as User);

  const handleChange = (field: keyof User, value: any) => {
    setUser({ ...userState, [field]: value });
  };

  const handleSave = async () => {
    try {
      await updatedUser(userState);
      Alert.alert('Sucesso', 'Perfil atualizado com sucesso.');
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <View className="flex-row items-center px-5 py-3 border-b border-gray-200">
     
      </View>

      {/* Scroll + Form */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        className="flex-1"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          className="flex-1 px-5"
          contentContainerStyle={{ paddingBottom: 120 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar + Info */}
          <View className="mt-4 mb-6">
            <ProfileHeader
              name={userState.name}
              email={userState.email}
              photo={userData?.photoURL || userState.photo}
            />
          </View>

          {/* Form Container */}
          <View className="bg-gray-50 px-5 rounded-2xl shadow-sm space-y-5">
            <InputProfile
              label="Nome"
              value={userState.name}
              onChangeText={(val) => handleChange('name', val)}
            />
            <InputProfile
              label="Email"
              value={userState.email}
              onChangeText={() =>
                Alert.alert(
                  'Editar Email',
                  'Email não pode ser alterado. Para isso, vá até as configurações.',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Configurações',
                      onPress: () => navigation.push('(home)/settings'),
                    },
                  ]
                )
              }
            />
            <InputProfile
              label="Telefone"
              value={userState.phone || ''}
              onChangeText={(val) => handleChange('phone', val)}
            />
            <InputProfile
              label="Endereço"
              value={userState.address || ''}
              onChangeText={(val) => handleChange('address', val)}
            />

            {userState.userType === 'supplier' && (
              <InputProfile
                label="Preço por litro (Kz)"
                value={userState.pricePerLiter?.toString() || ''}
                onChangeText={(val) =>
                  handleChange('pricePerLiter', Number(val))
                }
              />
            )}
          </View>
        </ScrollView>

        {/* Botão fixo no final */}
        <View className="absolute bottom-5 left-5 right-5 flex-row gap-3">
  {/* Botão Voltar (Secundário) */}
  <TouchableOpacity
    onPress={() => navigation.back()}
    className="flex-1 py-3 bg-white border border-gray-300 rounded-2xl items-center shadow-sm"
  >
    <Text className="text-gray-700 font-semibold">Voltar</Text>
  </TouchableOpacity>

  {/* Botão Salvar (Primário) */}
  <TouchableOpacity
    onPress={handleSave}
    className="flex-1 py-3 bg-blue-600 rounded-2xl items-center shadow-md"
  >
    <Text className="text-white font-semibold">Salvar</Text>
  </TouchableOpacity>
</View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
