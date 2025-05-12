import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

interface LocationMapProps {
  location: Location.LocationObject | null;
  errorMsg: string | null;
  loading: boolean;
}

const OrderMap: React.FC<LocationMapProps> = ({ location, errorMsg, loading }) => {

  if (!location) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Localização não disponível</Text>
      </View>
    );
  }

  return (
    <MapView
      mapType="standard"
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
  );
};

export default OrderMap;