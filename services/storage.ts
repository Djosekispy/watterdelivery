import * as SecureStore from 'expo-secure-store';
import { User } from '@/types';

const CURRENT_USER_KEY = 'agua_expressa_current_user';

export async function saveUserToStorage(user: Partial<User>) {
  const safeUser = {
    id: user.id,
    name: user.name,
    email: user.email,
    photo: user.photo || '',
    userType: user.userType,
    location: user.location || null,
  phone: user.phone || '',
  address: user.address || '',
  pricePerLiter: user.pricePerLiter || null,
  createdAt : user.createdAt || null
  };
  await SecureStore.setItemAsync(CURRENT_USER_KEY, JSON.stringify(safeUser));
}

export async function getUserFromStorage(): Promise<User | null> {
  const json = await SecureStore.getItemAsync(CURRENT_USER_KEY);
  return json ? JSON.parse(json) : null;
}

export async function clearUserFromStorage() {
  await SecureStore.deleteItemAsync(CURRENT_USER_KEY);
}
