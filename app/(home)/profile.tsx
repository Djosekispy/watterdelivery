import { ProfileHeader } from '@/components/layout/ProfileHeader';
import { ButtonProfile } from '@/components/ui/ButtonProfile';
import { InputProfile } from '@/components/ui/InputProfile';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { ScrollView, Alert, View, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeft } from 'lucide-react-native'; // ou outro ícone compatível

const ProfileScreen = () => {
  const navigation = useNavigation();
  const { user, updatedUser } = useAuth();
  const userDate = getAuth().currentUser;
  const [userState, setUser] = useState<User>(user as User);

  const handleChange = (field: keyof User, value: any) => {
    setUser({ ...userState, [field]: value });
  };

  const handleSave = async () => {
    try {
      await updatedUser(userState);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível atualizar o perfil.');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-6 pt-10">
      {/* Botão de Voltar */}
      <View className="flex-row items-center mb-4">
        <TouchableOpacity onPress={() => navigation.goBack()} className="p-2 rounded-full bg-white shadow">
          <ArrowLeft size={24} color="#333" />
        </TouchableOpacity>
        <Text className="ml-4 text-xl font-semibold text-gray-800">Editar Perfil</Text>
      </View>

      {/* Cabeçalho do Perfil */}
      <ProfileHeader
        name={userState.name}
        email={userState.email}
        photo={userDate?.photoURL  || userState.photo}
      />

      <View className="bg-white p-4 rounded-2xl shadow mt-6 space-y-4">
        <InputProfile
          label="Nome"
          value={userState.name}
          onChangeText={val => handleChange('name', val)}
        />
        <InputProfile
          label="Email"
          value={userState.email}
          onChangeText={val => handleChange('email', val)}
        />
        <InputProfile
          label="Telefone"
          value={userState.phone || ''}
          onChangeText={val => handleChange('phone', val)}
        />
        <InputProfile
          label="Endereço"
          value={userState.address || ''}
          onChangeText={val => handleChange('address', val)}
        />

        {userState.userType === 'supplier' && (
          <InputProfile
            label="Preço por litro (Kz)"
            value={userState.pricePerLiter?.toString() || ''}
            onChangeText={val => handleChange('pricePerLiter', Number(val))}
          />
        )}

        <ButtonProfile label="Salvar Alterações" onPress={handleSave} />
      </View>
    </ScrollView>
  );
};

export default ProfileScreen;
