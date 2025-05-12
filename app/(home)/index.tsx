import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Modal, Text, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import ProfileModal from '@/components/screens/ProfileModal';
import MapsAnimation from '@/components/ui/location-search';

interface MenuOption {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  action: ()=>void;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [Showprofile, setShowProfile ] = useState<boolean>(false)

  useEffect(() => {
    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permissão para acessar a localização foi negada');
          setLoading(false);
          return;
        }

        const currentLocation = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        setLocation(currentLocation);
      } catch (error) {
        setErrorMsg('Erro ao obter localização');
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    getLocation();
  }, []);

  const menuOptions: MenuOption[] = [
    { icon: 'account', label: 'Perfil', action: ()=>{setShowProfile(true)} },
    { icon: 'history', label: 'Histórico', action: ()=>{setShowProfile(true)} },
    { icon: 'cart', label: 'Pedidos', action: ()=>{setShowProfile(true)} },
    { icon: 'cog', label: 'Configurações', action: ()=>{setShowProfile(true)} },
     { icon: 'login', label: 'entrar', action: ()=>{setShowProfile(true)} },
     { icon: 'logout', label: 'sair', action: ()=>{setShowProfile(true)} },
  ];

  return (
    <View className="flex-1">
      <ProfileModal visible={Showprofile} onClose={()=>setShowProfile(false)}  />
      {errorMsg && (
        <View className="absolute top-6 z-50 w-full px-4">
          <Text className="bg-red-500 text-white p-4 rounded-lg text-center">
            {errorMsg}
          </Text>
        </View>
      )}

      {loading ? (
          <MapsAnimation />
      ) : (
        location && (
          <MapView
          mapType='standard'
            style={{ flex: 1 }}
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
              coordinate={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
              }}
              title="Sua localização"
              description="Você está aqui"
            />
          </MapView>
        )
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
                 // router.push(option.route);
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
