
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '@/types';
import { toast } from "sonner";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  updateUserLocation: (location: { lat: number; lng: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock database of users
const MOCK_USERS_KEY = 'agua_expressa_users';
const CURRENT_USER_KEY = 'agua_expressa_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
   const router = useRouter();
  // Initialize mock data if needed
  useEffect(() => {
    // Load users from SecureStore or initialize with empty array
    const existingUsers = SecureStore.getItem(MOCK_USERS_KEY);
    if (!existingUsers) {
      // Create some mock suppliers
      const initialUsers = [
        {
          id: '1',
          name: 'Água Pura Ltda',
          email: 'supplier1@example.com',
          userType: 'supplier' as UserType,
          phone: '(11) 99999-1111',
          pricePerLiter: 0.15,
          location: { lat: -23.5505, lng: -46.6333 },
        },
        {
          id: '2',
          name: 'Aqua Delivery',
          email: 'supplier2@example.com',
          userType: 'supplier' as UserType,
          phone: '(11) 99999-2222',
          pricePerLiter: 0.12,
          location: { lat: -23.5605, lng: -46.6433 },
        },
        {
          id: '3',
          name: 'H2O Express',
          email: 'supplier3@example.com',
          userType: 'supplier' as UserType,
          phone: '(11) 99999-3333',
          pricePerLiter: 0.18,
          location: { lat: -23.5305, lng: -46.6233 },
        },
      ];
      SecureStore.setItem(MOCK_USERS_KEY, JSON.stringify(initialUsers));
    }

    // Check if user is already logged in
    const savedUser = SecureStore.getItem(CURRENT_USER_KEY);
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);

  if(!user){
    router.push('/(home)/');
  }
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // In a real app, this would be an API call
      // For now, we'll simulate a delay and check against our mock data
      await new Promise(resolve => setTimeout(resolve, 1000));

      const usersJson = SecureStore.getItem(MOCK_USERS_KEY) || '[]';
      const users = JSON.parse(usersJson) as User[];

      const matchedUser = users.find(u => u.email === email);
      
      if (!matchedUser) {
        throw new Error('Usuário não encontrado');
      }

      // In a real app, we would verify the password hash
      // Here we're just simulating success
      
      // Save current user
      SecureStore.setItem(CURRENT_USER_KEY, JSON.stringify(matchedUser));
      setUser(matchedUser);
      toast.success('Login realizado com sucesso!');
    } catch (error) {
      console.error('Login error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer login');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Get existing users
      const usersJson = SecureStore.getItem(MOCK_USERS_KEY) || '[]';
      const users = JSON.parse(usersJson) as User[];

      // Check if email already exists
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Este email já está em uso');
      }

      // Create new user
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        photo : 'https://cdn3.iconfinder.com/data/icons/business-avatar-1/512/3_avatar-512.png',
        userType: userData.userType || 'consumer',
        ...(userData.userType === 'supplier' && { pricePerLiter: userData.pricePerLiter || 0 }),
        ...userData
      };

      // Save to "database"
      users.push(newUser);
      SecureStore.setItem(MOCK_USERS_KEY, JSON.stringify(users));

      // Log user in
      SecureStore.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      setUser(newUser);
      
      toast.success('Cadastro realizado com sucesso!');
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao fazer cadastro');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
   await  SecureStore.deleteItemAsync(CURRENT_USER_KEY);
    setUser(null);
    toast.info('Você saiu da sua conta');
  };

  const updateUserLocation = (location: { lat: number; lng: number }) => {
    if (!user) return;

    const updatedUser = { ...user, location };
    
    // Update in SecureStore
    SecureStore.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    
    // Update in users array
    const usersJson = SecureStore.getItem(MOCK_USERS_KEY) || '[]';
    const users = JSON.parse(usersJson) as User[];
    const updatedUsers = users.map(u => u.id === user.id ? {...u, location} : u);
    SecureStore.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers));
    
    // Update state
    setUser(updatedUser);
  };

  const value = {
    user,
    isLoading,
    login,
    register,
    logout,
    updateUserLocation
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};