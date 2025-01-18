export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  created_at: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string;
  staff_id: string;
  date: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  created_at: string;
}

export interface Sale {
  id: string;
  customer_id: string;
  total: number;
  payment_method: 'cash' | 'card';
  status: 'completed' | 'refunded';
  created_at: string;
}

export interface SaleItem {
  id: string;
  sale_id: string;
  product_id: string;
  quantity: number;
  price: number;
  created_at: string;
}