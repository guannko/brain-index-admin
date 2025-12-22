import axios from 'axios';
import { create } from 'zustand';

// Store for current client (demo mode - auto-selects first client)
interface ClientStore {
  clientId: string | null;
  clientName: string | null;
  setClient: (id: string, name: string) => void;
}

export const useClientStore = create<ClientStore>((set) => ({
  clientId: null,
  clientName: null,
  setClient: (id, name) => set({ clientId: id, clientName: name }),
}));

// API instance
export const api = axios.create({
  baseURL: 'http://localhost:3000/api/v1',
});

// Add client ID header dynamically
api.interceptors.request.use((config) => {
  const clientId = useClientStore.getState().clientId;
  if (clientId) {
    config.headers['x-client-id'] = clientId;
  }
  return config;
});

// Types
export interface Bot {
  id: string;
  name: string;
  username: string | null;
  platform: 'TELEGRAM' | 'WHATSAPP' | 'DISCORD';
  isOnline: boolean;
  config: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  status: string;
  description: string | null;
}

export interface DashboardData {
  clientName: string;
  clientEmail: string;
  company: string | null;
  stats: {
    activeBots: number;
    onlineBots: number;
    automations: number;
    totalMessages: number;
    supportUntil: string;
  };
  bots: Bot[];
  projects: Project[];
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
}

// API functions
export const portalApi = {
  getDashboard: () => api.get<DashboardData>('/portal/dashboard').then(res => res.data),
  getBots: () => api.get<Bot[]>('/portal/bots').then(res => res.data),
};

// Helper to get all clients (for demo client selector)
export const getClients = () => api.get<Client[]>('/clients').then(res => res.data);
