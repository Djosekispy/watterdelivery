import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { User } from '@/types';
import { db } from './firebase';

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('id', '==', userId));
    const querySnapshot = await getDocs(q);
    const userDoc  = querySnapshot.docs[0];

    if (userDoc) {
      return  userDoc.data() as unknown as User;
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};