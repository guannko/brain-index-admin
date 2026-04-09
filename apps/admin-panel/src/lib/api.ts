import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

export const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface Bot {
  id: string;
  name: string;
  platform: 'TELEGRAM' | 'WHATSAPP' | 'DISCORD';
  username: string | null;
  isOnline: boolean;
  config: Record<string, unknown>;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  status: 'DISCOVERY' | 'DEVELOPMENT' | 'DELIVERED' | 'SUPPORT';
  price: number | null;
  startDate: string;
  deliveryDate: string | null;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  company: string | null;
  phone: string | null;
  status: 'LEAD' | 'ACTIVE' | 'PAUSED' | 'CHURNED';
  projects: Project[];
  bots: Bot[];
  createdAt: string;
  updatedAt: string;
}

// API Functions
export const clientsApi = {
  getAll: () => api.get<Client[]>('/clients').then(res => res.data),
  getOne: (id: string) => api.get<Client>(`/clients/${id}`).then(res => res.data),
  create: (data: Partial<Client>) => api.post<Client>('/clients', data).then(res => res.data),
  update: (id: string, data: Partial<Client>) => api.put<Client>(`/clients/${id}`, data).then(res => res.data),
  delete: (id: string) => api.delete(`/clients/${id}`),
};

export const heartbeatApi = {
  getAll: () => api.get<Record<string, { status: string; lastPing: string | null }>>('/heartbeat').then(res => res.data),
};
