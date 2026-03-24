export type OrderItem = {
  quantity: number;
  dish_id: number;
  Dishes: { name: string; price?: number } | null;
};

export type Profile = {
  first_name: string;
  last_name: string;
  email: string;
};

export type Order = {
  order_id: number;
  menu_id: number;
  timestamp: string;
  total: number;
  user_id: string;
  profiles: Profile | null;
  OrderItems: OrderItem[];
};

export type DishStat = { 
  name: string; 
  quantity: number; 
  revenue: number 
};

export type BuyerStat = { 
  id: string; 
  name: string; 
  orders: number; 
  spent: number 
};

export type TrendStat = { 
  date: string; 
  revenue: number; 
  orders: number; 
  aov: number 
};

export type DayStat = { 
  day: string; 
  revenue: number; 
  orders: number; 
  index: number 
};

export type TabOption = 
  | "top-dishes" 
  | "lowest-dishes" 
  | "revenue-by-dish" 
  | "revenue-by-day"
  | "top-buyers" 
  | "top-buyers-orders"
  | "order-times" 
  | "revenue-trend";