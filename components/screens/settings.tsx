import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  Switch,
  Alert,
  TextInput,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updateEmail, updatePassword } from 'firebase/auth';

interface SettingsModalProps {
  visible: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ visible, onClose }) => {

  const [settings, setSettings] = useState({
    notifications: true,
    darkMode: false,
    locationAccess: true,
    autoSync: false,
    biometricAuth: true,
  });

  const auth = getAuth();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

 

  const reauthenticate = async () => {
    if (!user?.email) throw new Error('Email não disponível para reautenticação');
    const credential = EmailAuthProvider.credential(user.email, currentPassword);
    await reauthenticateWithCredential(user, credential);
  };

  const handleUpdateEmail = async () => {
    if (!newEmail) return Alert.alert('Erro', 'Digite o novo email');
    try {
      await reauthenticate();
      if(!auth.currentUser) return ;
      await updateEmail(auth.currentUser, newEmail);
      Alert.alert('Sucesso', 'Email atualizado com sucesso!');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar o email.');
    }
  };

  const handleUpdatePassword = async () => {
    if (!newPassword || newPassword !== confirmPassword) {
      return Alert.alert('Erro', 'As senhas não coincidem.');
    }
    try {
      await reauthenticate();
      if(!auth.currentUser) return;
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Sucesso', 'Senha atualizada com sucesso!');
      setModalVisible(false);
    } catch (error) {
      console.error(error);
      Alert.alert('Erro', 'Não foi possível atualizar a senha.');
    }
  };

  const openModal = (option: string) => {
    setSelectedOption(option);
    setModalVisible(true);
  };

  const OptionButton = ({ label, onPress }: { label: string; onPress: () => void }) => (
    <TouchableOpacity
      className="p-4 bg-white rounded-xl mb-3 border border-gray-200 shadow-sm"
      onPress={onPress}
    >
      <Text className="text-gray-800 font-medium text-base">{label}</Text>
    </TouchableOpacity>
  );

  const SettingItem = ({
    icon,
    label,
    description,
    value,
    onValueChange,
    disabled = false,
  }: {
    icon: keyof typeof MaterialCommunityIcons.glyphMap;
    label: string;
    description?: string;
    value: boolean;
    onValueChange: (value: boolean) => void;
    disabled?: boolean;
  }) => (
    <View className={`flex-row items-center justify-between p-4 rounded-xl mb-3 ${disabled ? 'opacity-60' : ''}`}>
      <View className="flex-row items-center flex-1">
        <View className={`p-3 rounded-lg mr-4 ${disabled ? 'bg-gray-200' : 'bg-blue-100'}`}>
          <MaterialCommunityIcons 
            name={icon} 
            size={24} 
            color={disabled ? '#6B7280' : '#3B82F6'} 
          />
        </View>
        <View className="flex-1">
          <Text className={`text-base font-medium ${disabled ? 'text-gray-500' : 'text-gray-800'}`}>
            {label}
          </Text>
          {description && (
            <Text className="text-xs text-gray-500 mt-1">
              {description}
            </Text>
          )}
        </View>
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
        trackColor={{ true: '#3B82F6', false: '#E5E7EB' }}
        thumbColor="#FFFFFF"
      />
    </View>
  );

  const SectionHeader = ({ title }: { title: string }) => (
    <Text className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 px-4">
      {title}
    </Text>
  );

  return (
    <>
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
      >
        <View className={`bg-white rounded-t-3xl ${Platform.OS === 'ios' ? 'pb-8' : 'pb-4'}`}>
          <View className="w-12 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-4" />
          
          <ScrollView 
            className="px-4"
            showsVerticalScrollIndicator={false}
          >
            <View className="max-w-md w-full self-center pb-6">
          
              <SectionHeader title="Preferências" />
              <SettingItem
                icon="bell-outline"
                label="Notificações"
                description="Receber notificações do aplicativo"
                value={settings.notifications}
                onValueChange={() => toggleSetting('notifications')}
              />
              <SettingItem
                icon="weather-night"
                label="Modo escuro"
                value={settings.darkMode}
                onValueChange={() => toggleSetting('darkMode')}
              />
              <SettingItem
                icon="autorenew"
                label="Sincronização automática"
                description="Sincronizar dados automaticamente"
                value={settings.autoSync}
                onValueChange={() => toggleSetting('autoSync')}
              />

              <SectionHeader title="Segurança" />
              <SettingItem
                icon="fingerprint"
                label="Autenticação biométrica"
                value={settings.biometricAuth}
                onValueChange={() => toggleSetting('biometricAuth')}
              />

              <SectionHeader title="Privacidade" />
              <SettingItem
                icon="map-marker"
                label="Compartilhar localização"
                description="Permitir acesso à sua localização"
                value={settings.locationAccess}
                onValueChange={() => toggleSetting('locationAccess')}
                disabled={true} // Exemplo de condição para desabilitar
              />
            <OptionButton label="Alterar Email" onPress={() => openModal('email')} />
            <OptionButton label="Alterar Senha" onPress={() => openModal('password')} />
              <TouchableOpacity
                className="mt-6 bg-red-50 p-4 rounded-xl items-center"
                onPress={() => {
                  onClose();
                }}
              >
                <Text className="text-red-600 font-semibold">Fechar</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  
       {/* Modal Centralizado com Blur */}
       <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
        statusBarTranslucent
      >
        <View className="flex-1 bg-black/40 justify-center items-center">
          <View className="bg-white rounded-2xl p-6 w-11/12 max-w-md">
            <Text className="text-lg font-semibold text-gray-800 mb-4 capitalize">
              {selectedOption === 'email' && 'Atualizar Email'}
              {selectedOption === 'password' && 'Atualizar Senha'}
              {['language', 'notifications', 'privacy'].includes(selectedOption) && `${selectedOption} (fake)`}
            </Text>

            {selectedOption === 'email' && (
              <>
                <TextInput
                  placeholder="Senha Atual"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                />
                <TextInput
                  placeholder="Novo Email"
                  keyboardType="email-address"
                  value={newEmail}
                  onChangeText={setNewEmail}
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                />
                <TouchableOpacity onPress={handleUpdateEmail} className="bg-blue-600 py-3 rounded-lg">
                  <Text className="text-white text-center font-semibold">Atualizar Email</Text>
                </TouchableOpacity>
              </>
            )}

            {selectedOption === 'password' && (
              <>
                <TextInput
                  placeholder="Senha Atual"
                  secureTextEntry
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                />
                <TextInput
                  placeholder="Nova Senha"
                  secureTextEntry
                  value={newPassword}
                  onChangeText={setNewPassword}
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                />
                <TextInput
                  placeholder="Confirmar Nova Senha"
                  secureTextEntry
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  className="border border-gray-300 rounded-lg px-4 py-3 mb-3"
                />
                <TouchableOpacity onPress={handleUpdatePassword} className="bg-blue-600 py-3 rounded-lg">
                  <Text className="text-white text-center font-semibold">Atualizar Senha</Text>
                </TouchableOpacity>
              </>
            )}

            {['language', 'notifications', 'privacy'].includes(selectedOption) && (
              <Text className="text-gray-600">Funcionalidade fake para demonstração visual.</Text>
            )}

            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className="mt-4 self-center"
            >
              <Text className="text-blue-600 font-medium">Fechar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
   </>
  );
};

export default SettingsModal;