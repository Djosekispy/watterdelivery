import React, { useContext, useEffect, useRef, useState } from 'react';
import { View, TouchableOpacity, Modal, Text, StyleSheet, Platform } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { MapType, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import { LocationContext } from '@/context/LocationContext';
import { useRouter } from 'expo-router';
import DropDownPicker from 'react-native-dropdown-picker';
import SettingsModal from '@/components/screens/settings';
import ProfileModal from '@/components/screens/ProfileModal';
import MapsAnimation from '@/components/ui/location-search';



interface MenuOption {
  icon: keyof typeof MaterialCommunityIcons.glyphMap;
  label: string;
  action: () => void;
}

const HomeScreen = () => {
  const { user } = useAuth();
  const mapRef = useRef<MapView>(null);
  const router = useRouter();
  const [mapType, setMapType] = useState<MapType>('standard');
  const [showSettings, setShowSettings] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const { location, errorMsg, loading } = useContext(LocationContext);
  const [showProfile, setShowProfile] = useState(false);
  const [mapReady, setMapReady] = useState(false);
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<{label : string, value: MapType, icon : ()=>void}[]>([
    {label: 'Padrão', value: 'standard', icon: () => <MaterialCommunityIcons name="map-outline" size={20} color="#3B82F6" />},
     {label: 'Padrão Superior', value: 'mutedStandard', icon: () => <MaterialCommunityIcons name="map-check-outline" size={20} color="#3B82F6" />},
    {label: 'Satélite', value: 'satellite', icon: () => <MaterialCommunityIcons name="satellite-variant" size={20} color="#3B82F6" />},
    {label: 'Satélite Superior', value: 'satelliteFlyover', icon: () => <MaterialCommunityIcons name="satellite-uplink" size={20} color="#3B82F6" />},
    {label: 'Híbrido', value: 'hybrid', icon: () => <MaterialCommunityIcons name="layers" size={20} color="#3B82F6" />},
    {label: 'Híbrido Superior', value: 'hybridFlyover', icon: () => <MaterialCommunityIcons name="layers-plus" size={20} color="#3B82F6" />},
    {label: 'Terreno', value: 'terrain', icon: () => <MaterialCommunityIcons name="terrain" size={20} color="#3B82F6" />},
   
   
  
  ]);

  const menuOptions: MenuOption[] = [
    user &&  { icon: 'account', label: 'Perfil', action: () => setShowProfile(true) },
    { icon: 'history', label: 'Histórico', action: () => setShowProfile(true) },
    { icon: 'cart', label: 'Pedidos', action: () => setShowProfile(true) },
    { icon: 'cog', label: 'Configurações', action: () => setShowSettings(true) },
  ! user &&   { icon: 'login', label: 'entrar', action: () => router.replace('/(auth)/') },
  ];

  const handleMapLayout = () => {
    setMapReady(true);
  };

  return (
    <View className="flex-1">
      <ProfileModal visible={showProfile} onClose={() => setShowProfile(false)} />
      <SettingsModal visible={showSettings} onClose={() => setShowSettings(false)} />

      {/* Dropdown para seleção do tipo de mapa */}
      <View style={styles.dropdownContainer}>
        <DropDownPicker
          open={open}
          value={mapType}
          items={items}
          setOpen={setOpen}
          setValue={setMapType}
          setItems={setItems}
          placeholder="Tipo de mapa"
          placeholderStyle={{color: '#9CA3AF'}}
          style={styles.dropdown}
          dropDownContainerStyle={{
            backgroundColor: 'white',
            borderColor: '#E5E7EB',
            borderRadius: 12,
            marginTop: 4,
          }}
          itemStyle={styles.dropdownItem}
          labelStyle={styles.dropdownLabel}
          textStyle={{fontSize: 14}}
          showArrowIcon={true}
          showTickIcon={true}
          listItemLabelStyle={{color: '#374151'}}
          selectedItemLabelStyle={{color: '#3B82F6', fontWeight: '600'}}
          selectedItemContainerStyle={{backgroundColor: '#EFF6FF'}}
          modalProps={{
            animationType: 'fade',
          }}
          modalTitle="Selecione o tipo de mapa"
          modalTitleStyle={{color: '#111827', fontWeight: '600'}}
          listMode="MODAL" // Usar MODAL para melhor experiência em mobile
        />
      </View>

      {loading ? (
        <MapsAnimation />
      ) : (
        <View className="flex-1">
          {location && (
            <MapView
              ref={mapRef}
              provider={PROVIDER_GOOGLE}
              mapType={mapType}
              style={StyleSheet.absoluteFillObject}
              followsUserLocation={true}
              googleRenderer='LATEST'
              onMoveShouldSetResponder={(event) => {
               // alert('esta se movimentando')
                return true;
              }}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.005,
                longitudeDelta: 0.005,
              }}
              showsUserLocation
              showsMyLocationButton
              onLayout={handleMapLayout}
            >
              {mapReady && (
                <Marker
                  coordinate={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                  }}
                  title="Sua localização"
                  description="Você está aqui"
                />
              )}
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


const styles = StyleSheet.create({
  dropdownContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 16,
    zIndex: 1000,
    width: 160,
  },
  dropdown: {
    backgroundColor: 'white',
    borderColor: '#E5E7EB',
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownItem: {
    justifyContent: 'flex-start',
  },
  dropdownLabel: {
    fontSize: 14,
    color: '#374151',
  },
});
export default HomeScreen;