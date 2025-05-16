import { ProfileHeader } from '@/components/layout/ProfileHeader';
import { ButtonProfile } from '@/components/ui/ButtonProfile';
import { InputProfile } from '@/components/ui/InputProfile';
import { useAuth } from '@/context/AuthContext';
import { User } from '@/types';
import { getAuth } from 'firebase/auth';
import React, { useState } from 'react';
import { ScrollView, Alert } from 'react-native';




 const ProfileScreen = () => {
    const { user } = useAuth();
    const userDate = getAuth().currentUser;

  const handleChange = (field: keyof User, value: any) => {
    //setUser({ ...user, [field]: value });
  };

  const handleSave = () => {
    Alert.alert('Perfil atualizado', 'As informações foram salvas com sucesso.');
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 px-6 pt-10">
      <ProfileHeader name={user?.name || ''} email={user?.email || ''} photo={userDate?.photoURL as string} />
      <InputProfile label="Nome" value={user?.name || ''} onChangeText={val => handleChange('name', val)} />
      <InputProfile label="Email" value={user?.email || ''} onChangeText={val => handleChange('email', val)} />
      <InputProfile label="Telefone" value={user?.phone || ''} onChangeText={val => handleChange('phone', val)} />
      <InputProfile label="Endereço" value={user?.address || ''} onChangeText={val => handleChange('address', val)} />
{  user?.userType === 'supplier' && <InputProfile label="Preço por litro (Kz)" value={user?.pricePerLiter?.toString() || ''} onChangeText={val => handleChange('pricePerLiter', Number(val))} />}
<ButtonProfile label="Salvar Alterações" onPress={handleSave} />
    </ScrollView>
  );
};

export default ProfileScreen;
