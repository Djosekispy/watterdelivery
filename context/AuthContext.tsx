
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '@/types';
import { toast } from "sonner";
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { auth, db } from '@/services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDocFromCache, setDoc, Timestamp } from "firebase/firestore"; 

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
     const userCredential =  await  signInWithEmailAndPassword(auth, email, password);
     const user = userCredential.user;
     
     const docRef = doc(db, "users", user.uid);
     const docUser   = await getDocFromCache(docRef);
     SecureStore.setItem(CURRENT_USER_KEY, JSON.stringify(docUser));
     setUser(docUser as any);
      router.push('/(home)/')
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
    try {
      createUserWithEmailAndPassword(auth,user?.email as string, user?.password as string).then( async (userCredential) => {
        const user = userCredential.user;
      const newUser: User = {
        id: Date.now().toString(),
        name: userData.name || '',
        email: userData.email || '',
        password : user.uid || '',
        photo : user.photoURL || '',
        userType: userData.userType || 'consumer',
        ...(userData.userType === 'supplier' && { pricePerLiter: userData.pricePerLiter || 0 }),
        ...userData
      };
    await setDoc(doc(db, "users", user.uid ), newUser);
      })
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    toast.info('Você saiu da sua conta');
  };

  const updateUserLocation = (location: { lat: number; lng: number }) => {
    if (!user) return;

    const updatedUser = { ...user, location };
    SecureStore.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    const usersJson = SecureStore.getItem(MOCK_USERS_KEY) || '[]';
    const users = JSON.parse(usersJson) as User[];
    const updatedUsers = users.map(u => u.id === user.id ? {...u, location} : u);
    SecureStore.setItem(MOCK_USERS_KEY, JSON.stringify(updatedUsers));
    
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