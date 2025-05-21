import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { ArrowLeft } from 'lucide-react-native';
import { getAuth, updateEmail, updatePassword, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';

const SettingsScreen = () => {
  const navigation = useNavigation();
  const auth = getAuth();
  const user = auth.currentUser;

  const [currentPassword, setCurrentPassword] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');

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

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <TouchableOpacity onPress={() => navigation.goBack()} className="mb-6">
        <ArrowLeft size={24} color="#1E3A8A" />
      </TouchableOpacity>

      <Text className="text-2xl font-bold text-blue-900 mb-4">Configurações</Text>

      <ScrollView showsVerticalScrollIndicator={false}>
        <OptionButton label="Alterar Email" onPress={() => openModal('email')} />
        <OptionButton label="Alterar Senha" onPress={() => openModal('password')} />
        <OptionButton label="Idioma (fake)" onPress={() => openModal('language')} />
        <OptionButton label="Notificações (fake)" onPress={() => openModal('notifications')} />
        <OptionButton label="Privacidade (fake)" onPress={() => openModal('privacy')} />
      </ScrollView>

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
    </View>
  );
};

export default SettingsScreen;
