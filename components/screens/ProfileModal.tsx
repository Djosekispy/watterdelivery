import React, { useContext } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { auth } from '@/services/firebase';
import { LocationContext } from '@/context/LocationContext';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose}) => {
  const { user, updatedUser } = useAuth();

  const { location, errorMsg, loading } = useContext(LocationContext);
  const router = useRouter();
  const defaultImage = 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png';
  const userLocation = {
    lat: location?.coords.latitude as number,
    lng: location?.coords.longitude as number,
  }

  const ProfileSection = () => (
    <View className="flex-row items-center mb-6 px-4 mx-4">
      <View className="relative mr-4">
        <Image
          source={{ uri : user?.photo || auth.currentUser?.photoURL || defaultImage}}
         style={{ width: 60, height: 60 }} 
          className="rounded-full  bg-gray-200" 
          contentFit="cover"
        />
      </View>
      <View>
        <Text className="text-xl font-bold text-gray-800">
          {user?.name || 'Usuário'}
        </Text>
        <Text className="text-sm text-gray-500 mt-1">
          {user?.email || 'email@exemplo.com'}
        </Text>
      </View>
    </View>
  );

  const InfoItem = ({
    icon,
    label,
    value,
  }: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    value: string;
  }) => (
    <View className="flex-row items-center p-4 bg-gray-50 rounded-xl mb-3">
      <MaterialCommunityIcons name={icon} size={24} color="#3B82F6" />
      <View className="ml-3">
        <Text className="text-xs text-gray-500">{label}</Text>
        <Text className="text-base text-gray-800 font-medium">{value}</Text>
      </View>
    </View>
  );

  const ActionButton = ({
    icon,
    label,
    color,
    onPress,
  }: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      className={`flex-1 mx-2 p-4 rounded-xl flex-row items-center justify-center ${color}`}
      onPress={onPress}
      style={{
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <MaterialCommunityIcons name={icon} size={20} color="white" />
      <Text className="text-white font-semibold ml-2">{label}</Text>
    </TouchableOpacity>
  );

  const  formatarDataPortugues = (data : string) => {
    if (!data) return 'Data não disponível';
    
    const date = new Date(data);
    if (isNaN(date.getTime())) return 'Data inválida';
  
    const meses = [
      'janeiro', 'fevereiro', 'março', 'abril',
      'maio', 'junho', 'julho', 'agosto',
      'setembro', 'outubro', 'novembro', 'dezembro'
    ];
  
    const mes = meses[date.getMonth()];
    const ano = date.getFullYear();
  
    return `${mes} ${ano}`;
  }
  
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <TouchableOpacity 
        className="flex-1 bg-black/50 justify-end" 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View className={`bg-white rounded-t-3xl ${Platform.OS === 'ios' ? 'pb-8' : 'pb-4'}`}>
          <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
          
          <ScrollView 
            className="px-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="max-w-md w-full self-center">
              <ProfileSection />

              <View className="mb-6">
                <InfoItem
                  icon="phone"
                  label="Telefone"
                  value={user?.phone || 'Adicionar número'}
                />
                <InfoItem
                  icon="map-marker"
                  label="Endereço principal"
                  value={user?.address || 'Adicionar endereço'}
                />
                <InfoItem
                  icon="clock-outline"
                  label="Membro desde"
                  value={String(user?.createdAt)}
                />
              </View>

              <View className="flex-row mb-6">
                <ActionButton
                  icon="account-edit"
                  label="Editar Perfil"
                  color="bg-blue-500"
                  onPress={() => {
                    onClose();
                    router.push('/(home)/profile')
                  }}
                />
{
 user?.userType !== 'supplier' &&     <ActionButton
                  icon="water-boiler"
                  label="Ser Fornecedor"
                  color="bg-sky-400"
                  onPress={ async () => {
                    onClose();
                    await updatedUser({userType : 'supplier',location : userLocation},'Parabéns você agora é um fornecedor!')
                    router.push('/(home)/profile')
                  }}
                />}
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default ProfileModal;