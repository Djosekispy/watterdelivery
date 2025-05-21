import React, { useState } from 'react';
import { View, Image, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Camera } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { updateDoc, doc, collection, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '@/context/AuthContext';
import { db } from '@/services/firebase';

interface ProfileHeaderProps {
  name: string;
  photo: string;
  email: string;
}

export const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, photo, email }) => {
  const { user,updatePhoto } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [photoURL, setPhotoURL] = useState(photo);

  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets.length > 0) {
      const imageUri = result.assets[0].uri;
      setPhotoURL(imageUri);
      await uploadImageToFirebase(imageUri);
    }
  };

  const uploadImageToFirebase = async (uri: string) => {
    try {
      if (!user?.id) return;
      setUploading(true);
      const response = await fetch(uri);
      const blob = await response.blob();
      const storage = getStorage();
      const storageRef = ref(storage, `profile/${user.id}.jpg`);
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);
      await updatePhoto(downloadURL);
    } catch (error) {
      Alert.alert('Erro', `${error}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View className="items-center relative">
      <View className="relative">
        <Image
          source={{ uri: photoURL || user?.photo}}
          className="w-24 h-24 rounded-full border-2 border-blue-500"
        />
        <TouchableOpacity
          onPress={handlePickImage}
          className="absolute bottom-0 right-0 bg-blue-600 p-2 rounded-full shadow-md"
        >
          {uploading ? (
            <ActivityIndicator color="#fff" size={16} />
          ) : (
            <Camera color="#fff" size={16} />
          )}
        </TouchableOpacity>
      </View>
      <Text className="text-xl font-bold text-gray-800 mt-3">{name}</Text>
      <Text className="text-sm text-gray-500">{email}</Text>
    </View>
  );
};
