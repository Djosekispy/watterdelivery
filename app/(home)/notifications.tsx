import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Modal, StatusBar } from 'react-native';
import { useOrders } from '@/context/OrderContext';
import { useAuth } from '@/context/AuthContext';
import { useEffect, useState } from 'react';
import { Notification } from '@/types';
import { MaterialIcons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { router } from 'expo-router';

const NotificationsScreen = () => {
  const { user } = useAuth();
  const { notifications, unreadCount, markNotificationAsRead } = useOrders();
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleNotificationPress = async (notification: Notification) => {
    // Marca como lida
    if (!notification.read) {
      await markNotificationAsRead(notification.id);
    }
    
    // Abre o modal com detalhes
    setSelectedNotification(notification);
    setModalVisible(true);
  };

  const handleOrderPress = () => {
    if (selectedNotification?.relatedOrderId) {
      setModalVisible(false);
      router.push(`/(home)/${selectedNotification.relatedOrderId}`);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="dark-content" />
      <View className="p-4 pt-10">
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={() => router.back()}>
            <MaterialIcons name="arrow-back" size={24} color="#4b5563" />
          </TouchableOpacity>
          <Text className="text-xl font-bold text-gray-800">Notificações</Text>
          <View style={{ width: 24 }} />
        </View>

        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-xl font-bold">Novas</Text>
          {unreadCount > 0 && (
            <View className="bg-red-500 rounded-full px-2 py-1">
              <Text className="text-white text-xs">{unreadCount} não lidas</Text>
            </View>
          )}
        </View>

        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => handleNotificationPress(item)}
              className={`bg-white p-4 mb-2 rounded-lg shadow-sm ${!item.read ? 'border-l-4 border-blue-500' : ''}`}
            >
              <View className="flex-row justify-between mb-1">
                <Text className="font-medium">{item.title}</Text>
                <Text className="text-gray-500 text-xs">
                  {format(item.createdAt, "dd/MM HH:mm", { locale: pt })}
                </Text>
              </View>
              <Text className="text-gray-600" numberOfLines={2}>
                {item.message}
              </Text>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View className="flex-1 justify-center items-center mt-10">
              <Text className="text-gray-500">Nenhuma notificação encontrada</Text>
            </View>
          }
        />
      </View>

      {/* Modal de Detalhes */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center p-4">
          <View className="bg-white rounded-lg p-6">
            {selectedNotification && (
              <>
                <View className="flex-row justify-between items-center mb-4">
                  <Text className="text-lg font-bold">{selectedNotification.title}</Text>
                  <TouchableOpacity onPress={() => setModalVisible(false)}>
                    <MaterialIcons name="close" size={24} color="#6b7280" />
                  </TouchableOpacity>
                </View>

                <Text className="text-gray-700 mb-4">{selectedNotification.message}</Text>

                <Text className="text-gray-500 text-sm mb-4">
                  {format(selectedNotification.createdAt, "dd MMMM yyyy 'às' HH:mm", { locale: pt })}
                </Text>

                {selectedNotification.relatedOrderId && (
                  <TouchableOpacity
                    onPress={handleOrderPress}
                    className="bg-blue-100 p-3 rounded-lg flex-row items-center justify-center"
                  >
                    <MaterialIcons name="receipt" size={20} color="#3b82f6" />
                    <Text className="text-blue-600 ml-2 font-medium">
                      Ver Pedido Relacionado
                    </Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default NotificationsScreen;