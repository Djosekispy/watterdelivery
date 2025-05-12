// Dentro do seu componente principal (ex: HomeScreen ou ProfileModal.tsx)

import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

const ProfileModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const { user } = useAuth();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <TouchableOpacity
        className="flex-1 bg-black/50"
        activeOpacity={1}
        onPress={onClose}
      >
        <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6">
          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="items-center mb-4">
              <Image
                source={{
                  uri: user?.photo
                }}
                className="w-24 h-24 rounded-full mb-2"
              />
              <Text className="text-xl font-semibold text-gray-800">{user?.name}</Text>
              <Text className="text-sm text-gray-500">{user?.email}</Text>
            </View>

            <View className="mt-4 space-y-2">
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="phone" size={20} color="#4B5563" />
                <Text className="ml-2 text-base text-gray-700">
                  {user?.phone || 'Sem telefone'}
                </Text>
              </View>
              <View className="flex-row items-center">
                <MaterialCommunityIcons name="map-marker" size={20} color="#4B5563" />
                <Text className="ml-2 text-base text-gray-700">
                  {user?.address || 'Sem endereço'}
                </Text>
              </View>
            </View>

            <View className="mt-6 flex-row justify-between">
              <TouchableOpacity
                className="flex-1 mr-2 bg-blue-500 py-3 rounded-xl items-center"
                onPress={() => {
                  onClose();
                  // router.push('/edit-profile');
                }}
              >
                <Text className="text-white font-semibold">Editar Perfil</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 ml-2 bg-green-500 py-3 rounded-xl items-center"
                onPress={() => {
                  onClose();
                  // router.push('/edit-address');
                }}
              >
                <Text className="text-white font-semibold">Editar Endereço</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProfileModal;
