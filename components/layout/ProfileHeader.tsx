import React from 'react';
import { View, Image, Text } from 'react-native';

interface ProfileHeaderProps {
  name: string;
  photo: string;
  email: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, photo, email }) => (
  <View className="items-center mb-6">
    <Image
      source={{ uri: photo }}
      className="w-24 h-24 rounded-full mb-3 border-2 border-blue-500"
    />
    <Text className="text-xl font-bold text-gray-800">{name}</Text>
    <Text className="text-sm text-gray-500">{email}</Text>
  </View>
);
