import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import "../constants/global.css";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StatusBar } from 'react-native';
import '@/constants/global.css';
import { useAuth } from '@/context/AuthContext';

export {
  ErrorBoundary,
} from 'expo-router';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const { user, loading } = useAuth();
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      
    <StatusBar backgroundColor='transparent' translucent barStyle='dark-content' />
      <Stack screenOptions={{headerShown : false}}>
      <Stack.Screen name="(home)" options={{ headerShown: false }} />
      {user ? (
        // Rotas de Usuario Autenticado
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        ) : (
          // Rotas para Usuario Não Autenticado
          <Stack.Screen name="(home)" options={{ headerShown: false }} />
        )}
      </Stack>
  </GestureHandlerRootView>
  );
}
