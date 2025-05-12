import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Modal, Text, Alert, StyleSheet } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import ProfileModal from '@/components/screens/ProfileModal';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapsAnimation from '@/components/ui/location-search';
import { LocationContext } from '@/context/LocationContext';

interface MenuOption {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  action: () => void;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);
  const [menuVisible, setMenuVisible] = useState(false);
  const { location, errorMsg, loading } = useContext(LocationContext);
  const [Showprofile, setShowProfile] = useState<boolean>(false);
  const [mapReady, setMapReady] = useState(false);

  const menuOptions: MenuOption[] = [
    { icon: 'account', label: 'Perfil', action: () => { setShowProfile(true) } },
    { icon: 'history', label: 'Histórico', action: () => { setShowProfile(true) } },
    { icon: 'cart', label: 'Pedidos', action: () => { setShowProfile(true) } },
    { icon: 'cog', label: 'Configurações', action: () => { setShowProfile(true) } },
    { icon: 'login', label: 'entrar', action: () => { setShowProfile(true) } },
    { icon: 'logout', label: 'sair', action: () => { setShowProfile(true) } },
  ];

  const handleMapLayout = () => {
    setMapReady(true);
  };

  return (
    <View className="flex-1">
      <ProfileModal visible={Showprofile} onClose={()=>setShowProfile(false)} />
      {loading ? (
        <MapsAnimation />
      ) : (
        <View className="flex-1">
          {location && (
            <MapView
            ref={mapRef}
            mapType='satellite'
              provider={PROVIDER_GOOGLE}
              style={{...StyleSheet.absoluteFillObject }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              showsUserLocation
              showsMyLocationButton
            >
              <Marker
                key="userLocation"
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Sua localização"
                description="Você está aqui"
              />
            </MapView>
          )}
        </View>
      )}

      <TouchableOpacity
        onPress={() => setMenuVisible(true)}
        className="absolute bottom-6 right-6 bg-blue-500 rounded-full w-14 h-14 items-center justify-center shadow-lg"
      >
        <MaterialCommunityIcons name="menu" size={30} color="white" />
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <TouchableOpacity
          className="flex-1 bg-black/50"
          activeOpacity={1}
          onPress={() => setMenuVisible(false)}
        >
          <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6">
            {menuOptions.map((option, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center py-4 border-b border-gray-200"
                onPress={() => {
                  setMenuVisible(false);
                  option.action();
                }}
              >
                <MaterialCommunityIcons
                  name={option.icon}
                  size={24}
                  color="#0066CC"
                />
                <Text className="ml-4 text-lg text-gray-800">{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
};

export default HomeScreen;