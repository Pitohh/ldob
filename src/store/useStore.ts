import { create } from 'zustand';
import { Customer, Service, Product, Appointment, Sale } from '../types';

interface StoreState {
  customers: Customer[];
  services: Service[];
  products: Product[];
  appointments: Appointment[];
  sales: Sale[];
  setCustomers: (customers: Customer[]) => void;
  setServices: (services: Service[]) => void;
  setProducts: (products: Product[]) => void;
  setAppointments: (appointments: Appointment[]) => void;
  setSales: (sales: Sale[]) => void;
}

export const useStore = create<StoreState>((set) => ({
  customers: [],
  services: [],
  products: [],
  appointments: [],
  sales: [],
  setCustomers: (customers) => set({ customers }),
  setServices: (services) => set({ services }),
  setProducts: (products) => set({ products }),
  setAppointments: (appointments) => set({ appointments }),
  setSales: (sales) => set({ sales }),
}));