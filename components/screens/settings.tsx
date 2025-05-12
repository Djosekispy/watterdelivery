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
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { Image } from 'expo-image';

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

  const toggleSetting = (setting: keyof typeof settings) => {
    setSettings(prev => ({
      ...prev,
      [setting]: !prev[setting]
    }));
  };

 

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

              <TouchableOpacity
                className="mt-6 bg-red-50 p-4 rounded-xl items-center"
                onPress={() => {
                  // Lógica para logout
                  onClose();
                }}
              >
                <Text className="text-red-600 font-semibold">Sair da Conta</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

export default SettingsModal;