
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserType } from '@/types';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { auth, db } from '@/services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { addDoc, collection, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"; 
import Toast from '@/components/ui/toast';
import LoadingModal from '@/components/ui/loading';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Partial<User>, password: string) => Promise<void>;
  updatedUser : (user : Partial<User>)=> Promise<void>;
  updatePhoto : (photo : string)=> Promise<void>;
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
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
    
  const showToast = (type: 'success' | 'error', message : string) => {
    setToast({visible: true, message, type });
  };
   const router = useRouter();

  useEffect(() => {
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
    signInWithEmailAndPassword(auth, email, password).then(async (userCredential) => {
      const firebaseUser = userCredential.user;
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where('email', '==', email));
      const querySnapshot = await getDocs(q);
        const userDoc = querySnapshot.docs[0];
        setUser(userDoc.data() as User);
        SecureStore.setItem(CURRENT_USER_KEY, JSON.stringify(userDoc.data()));
        router.push("/(home)/");
    }).catch((error) => {
      showToast('error','Credenciais incorrectas');
    }).finally(() => {
      setIsLoading(false);
    }); 
};

const updatedUser = async (userData: Partial<User>) => {
  setIsLoading(true);
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('id', '==', user?.id));
  const querySnapshot = await getDocs(q);
  updateDoc(querySnapshot.docs[0].ref, {...userData}).then(() => {
    setUser(userData as User);
    showToast('success','Usuário atualizado com sucesso!');
  }).catch((error) => {
    showToast('error','Erro ao atualizar usuário!');
  }).finally(() => {
    setIsLoading(false);
  });
}

const updatePhoto = async (photo: string) => {
  setIsLoading(true);
  const usersRef = collection(db, 'users');
  const q = query(usersRef, where('id', '==', user?.id));
  const querySnapshot = await getDocs(q);
  updateDoc(querySnapshot.docs[0].ref, {photo}).then(() => {
    setUser({...user, photo} as User);
    showToast('success','Foto de perfil atualizada com sucesso!');
  }).catch((error) => {
    showToast('error','Erro ao atualizar foto de perfil!');
  }).finally(() => {
    setIsLoading(false);
  });
}


const register = async (userData: Partial<User>, password: string) => {
    setIsLoading(true);
  
      if (!userData.email || !password) {
        throw new Error("Email e senha são obrigatórios.");
      }
     createUserWithEmailAndPassword(auth, userData.email, password).then(async (userCredential) => {
      const firebaseUser = userCredential.user;
      const newUser: User = {
        id: firebaseUser.uid, 
        name: userData.name || '',
        email: userData.email || '',
        password: '', 
        photo: firebaseUser.photoURL || '',
        userType: userData.userType || 'consumer',
        createdAt : Timestamp.now().toDate(),
        ...(userData.userType === 'supplier' && {
          pricePerLiter: userData.pricePerLiter || 0
        }),
      };
      await addDoc(collection(db, "users"), newUser);
      await login(firebaseUser.email as string, password); 
    }).catch((error) => {
      showToast('error','Erro ao cadastrar!');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const logout = async () => {
    await signOut(auth);
    setUser(null);
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
    updatedUser,
    updatePhoto,
    logout,
    updateUserLocation
  };

  return (
  <>
        <Toast
        visible={toast.visible}
        message={toast.message}
        type={toast.type}
        onHide={() => setToast({ ...toast, visible: false })}
      />
        <LoadingModal visible={isLoading} />
  <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  </>
  )
  ;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};