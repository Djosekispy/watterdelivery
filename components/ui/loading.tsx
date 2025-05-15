import React from 'react';
import { Modal, View, Text, ActivityIndicator } from 'react-native';

interface LoadingModalProps {
  visible: boolean;
}

const LoadingModal = ({ visible }: LoadingModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View className="flex-1 bg-black/40 items-center justify-center">
        <View className="bg-white rounded-2xl p-6 items-center justify-center w-72 shadow-lg">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-700 text-base font-medium mt-4">Aguarde...</Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;
