
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'user' | 'admin';
}


export interface Dish {
  id: string;
  name: string;
  price: number;
  category: 'soups' | 'bowls' | 'entrees' | 'desserts' | 'beverages';
  stock: number;
  imageUrl?: string;
  description?: string;
}

export interface MenuDay {
  id: string;
  date: string;
  day: 'wednesday' | 'thursday' | 'friday';
}

export interface MenuDayDish {
  id: string;
  menuDayId: string;
  dishId: string;
  dish: Dish;
  stock: number;
}


export interface CartItem {
  dish: Dish;
  quantity: number;
}

export interface Cart {
  items: CartItem[];
}


export type OrderStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled';

export interface OrderItem {
  id: string;
  orderId: string;
  dishId: string;
  dish: Dish;
  quantity: number;
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  user?: User;
  timestamp: string;
  status: OrderStatus;
  notes?: string;
  items: OrderItem[];
  total: number;
}


export interface Review {
  id: string;
  userId: string;
  dishId: string;
  orderId: string;
  rating: number;
  comment: string;
  timestamp: string;
}


export interface ApiResponse<T> {
  data: T;
  message?: string;
  error?: string;
}
