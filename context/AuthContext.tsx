
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '@/types';
import { useRouter } from 'expo-router';
import { auth, db } from '@/services/firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, updateProfile } from 'firebase/auth';
import { addDoc, collection, getDocs, query, Timestamp, updateDoc, where } from "firebase/firestore"; 
import Toast from '@/components/ui/toast';
import LoadingModal from '@/components/ui/loading';
import { clearUserFromStorage, getUserFromStorage, saveUserToStorage } from '@/services/storage';
import { LocationContext } from './LocationContext';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (user: Partial<User>, password: string) => Promise<void>;
  updatedUser : (user : Partial<User>, message ? : string)=> Promise<void>;
  updatePhoto : (photo : string)=> Promise<void>;
  logout: () => void;
  updateUserLocation: (location: { lat: number; lng: number }) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS_KEY = 'agua_expressa_users';
const CURRENT_USER_KEY = 'agua_expressa_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ visible: false, message: '', type: 'success' as 'success' | 'error' });
  const { location, errorMsg, loading } = useContext(LocationContext);

  const showToast = (type: 'success' | 'error', message : string) => {
    setToast({visible: true, message, type });
  };
   const router = useRouter();

   useEffect(() => {
    const loadUser = async () => {
      const savedUser = await getUserFromStorage();
      setUser(savedUser);
      if (savedUser) {
        router.push('/(home)/');
      } else {
        router.push('/(auth)/login');
      }
      setIsLoading(false);
    };
    loadUser();
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
      saveUserToStorage(userDoc.data()).then( () => router.push("/(home)/") );
    }).catch((error) => {
      showToast('error',`${error}`);
    }).finally(() => {
      setIsLoading(false);
    }); 
};

const updatedUser = async (userData: Partial<User>, message ? : string) => {
  setIsLoading(true);
  const usersRef = collection(db, 'users');
  let q;

  if (user?.id) {
    q = query(usersRef, where('id', '==', user.id));
  } 
  if (user?.email) {
    q = query(usersRef, where('email', '==', user.email));
  } else {
    console.log('Deu Erro',JSON.stringify(userData))
    throw new Error('Nenhum ID ou email de usuário disponível para consulta');
  }
  const querySnapshot = await getDocs(q);
  updateDoc(querySnapshot.docs[0].ref, {...userData}).then( async() => {
   
    auth.currentUser && updateProfile(auth.currentUser, {
      displayName: userData.name,
    });
    setUser({
      ...user,
      ...userData,
    });
    await saveUserToStorage({...userData});
    showToast('success', message ?? 'Usuário atualizado com sucesso!');
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
  updateDoc(querySnapshot.docs[0].ref, {photo}).then(async() => {
    setUser({...user, photo} as User);
    await saveUserToStorage({...user, photo});
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
        online : true,
        phone: userData.phone || '',
        address: userData.address || '',
        photo: firebaseUser.photoURL || '',
        userType: userData.userType || 'consumer',
        createdAt : Timestamp.now().toDate(),
        ...(userData.userType === 'supplier' && {
          pricePerLiter: userData.pricePerLiter || 0
        }),
      };
       addDoc(collection(db, "users"), newUser);
       router.push({pathname:'/(auth)/login', params:{email : userData.email, password}})

    }).catch((error) => {
      showToast('error','Erro ao cadastrar!');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  const logout = async () => {
    await signOut(auth);
    // await updatedUser({online : false},'Até Breve!')
    await clearUserFromStorage();
    setUser(null);
  };

  const updateUserLocation = async (location: { lat: number; lng: number }) => {
    if (!user) return;
    const updatedUserData = { ...user, location };
    await updatedUser(updatedUserData)
    setUser(updatedUserData);
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