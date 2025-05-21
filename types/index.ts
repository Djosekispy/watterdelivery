
export type UserType = 'consumer' | 'supplier';

export interface User {
  id: string;
  name: string;
  photo : string;
  password: string;
  email: string;
  userType: UserType;
  createdAt : Date;
  location?: {
    lat: number;
    lng: number;
  };
  phone?: string;
  online ? : boolean;
  address?: string;
  pricePerLiter?: number;
}

export interface Order {
  id: string;
  consumerId: string;
  supplierId?: string;
  quantity: number; 
  status: OrderStatus;
  location: {
    address: string;
    lat: number;
    lng: number;
  };
  createdAt: Date;
  acceptedAt?: Date;
  deliveredAt?: Date;
  canceledAt?: Date;
  price?: number;
}

export type OrderStatus = 
  | 'pending' 
  | 'accepted'
  | 'in_transit'
  | 'delivered' 
  | 'canceled';

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  relatedOrderId?: string;
}

export interface Supplier extends User {
  userType: 'supplier';
  pricePerLiter: number;
  distanceKm?: number; 
}