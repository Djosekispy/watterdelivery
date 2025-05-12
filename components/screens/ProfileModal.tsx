import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Platform,
  StyleSheet,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { BlurView } from 'expo-blur';
import { Image } from 'expo-image';

interface ProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ visible, onClose }) => {
  const { user } = useAuth();
  const defaultImage = 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png';

  const ProfileSection = () => (
    <View style={styles.profileSection}>
      <View style={styles.avatarContainer}>
        <Image
          source={user?.photo || defaultImage}
          style={styles.avatar}
          contentFit="cover"
        />
        <View style={styles.cameraIcon}>
          <MaterialCommunityIcons name="camera" size={20} color="white" />
        </View>
      </View>
      <View>
  <Text style={styles.userName}>
        {user?.name || user?.name || 'Usuário'}
      </Text>
      <Text style={styles.userEmail}>
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
    <View style={styles.infoItem}>
      <MaterialCommunityIcons name={icon} size={24} color="#3B82F6" />
      <View style={styles.infoTextContainer}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
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
      style={[styles.actionButton, { backgroundColor: color }]}
      onPress={onPress}
    >
      <MaterialCommunityIcons name={icon} size={20} color="white" />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
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
        style={styles.modalOverlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <View style={styles.modalContainer}>
          <View style={styles.dragHandle} />
          
          <ScrollView 
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.contentContainer}>
              <ProfileSection />

              <View style={styles.infoSection}>
                <InfoItem
                  icon="phone"
                  label="Telefone"
                  value={ user?.phone || 'Adicionar número'}
                />
                <InfoItem
                  icon="map-marker"
                  label="Endereço principal"
                  value={user?.address || 'Adicionar endereço'}
                />
                <InfoItem
                  icon="clock-outline"
                  label="Membro desde"
                  value="Janeiro 2024"
                />
              </View>

              <View style={styles.actionsRow}>
                <ActionButton
                  icon="account-edit"
                  label="Editar Perfil"
                  color="#3B82F6"
                  onPress={() => {
                    onClose();
                    // Navegar para editar perfil
                  }}
                />
                <ActionButton
                  icon="map-marker-plus"
                  label="Endereços"
                  color="#10B981"
                  onPress={() => {
                    onClose();
                    // Navegar para editar endereços
                  }}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '85%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E5E7EB',
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 20,
  },
  contentContainer: {
    maxWidth: 500,
    width: '100%',
    alignSelf: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 4,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 60,
    backgroundColor: '#F3F4F6',
  },
  cameraIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3B82F6',
    padding: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'white',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  infoSection: {
    marginBottom: 32,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginBottom: 12,
  },
  infoTextContainer: {
    marginLeft: 12,
  },
  infoLabel: {
    fontSize: 12,
    color: '#6B7280',
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
    marginTop: 4,
  },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionButtonText: {
    color: 'white',
    fontWeight: '600',
    marginLeft: 8,
  },
});

export default ProfileModal;