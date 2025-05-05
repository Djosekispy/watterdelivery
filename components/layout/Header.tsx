import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import Logo from '@/components/Logo';
import { Bell, LogOut, User } from 'lucide-react-native';
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator 
} from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/AuthContext';
import { useOrders } from '@/context/OrderContext';
import { Button } from '../ui/Button';
import { useRouter } from 'expo-router';

const Header = () => {
  const { user, logout } = useAuth();
  const { unreadNotificationsCount } = useOrders();
  const router = useRouter();

  const goNext = (route : any) => {
    router.replace(route)
  }

  const handleLogout = () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sair',
          onPress: () => {
            logout();
            goNext('Login');
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <View className="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
      <View className="container mx-auto px-4 py-3 flex flex-row justify-between items-center">
        <TouchableOpacity onPress={() => goNext('Home')}>
          <Logo />
        </TouchableOpacity>

        <View className="flex flex-row items-center gap-4">
          {user ? (
            <>
              <TouchableOpacity 
                className="relative"
                onPress={() => goNext('Notifications')}
              >
                <Bell  size={20}  />
                {unreadNotificationsCount > 0 && (
                  <View className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                    <Text className="text-white text-xs font-bold">
                      {unreadNotificationsCount > 9 ? '9+' : unreadNotificationsCount}
                    </Text>
                  </View>
                )}
              </TouchableOpacity>

              <DropdownMenu>
                <DropdownMenuTrigger>
                  <Button variant="outline" className="flex flex-row items-center gap-2">
                    <User size={16}  />
                    <Text className="hidden sm:inline">{user.name}</Text>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>Minha Conta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={() => goNext('Profile')}>
                    <Text>Perfil</Text>
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => goNext('Orders')}>
                    <Text>Meus Pedidos</Text>
                  </DropdownMenuItem>
                  {user.userType === 'consumer' && (
                    <DropdownMenuItem onSelect={() => goNext('Suppliers')}>
                      <Text>Fornecedores</Text>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onSelect={handleLogout}>
                    <View className="flex flex-row items-center">
                      <LogOut size={16} color="#ef4444" className="mr-2" />
                      <Text className="text-red-500">Sair</Text>
                    </View>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <View className="flex flex-row gap-2">
              <Button variant="outline" onPress={() => goNext('Login')}>
                <Text>Entrar</Text>
              </Button>
              <Button onPress={() => goNext('Register')}>
                <Text className="text-white">Cadastrar</Text>
              </Button>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

export default Header;