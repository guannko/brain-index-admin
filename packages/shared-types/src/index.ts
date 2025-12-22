// ============================================
// Brain Index - Shared Types
// ============================================

// ---------- Auth ----------
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  DEVELOPER = 'developer',
  SUPPORT = 'support',
  CLIENT = 'client',
}

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'active' | 'paused' | 'churned';
  dashboardAccess: boolean;
  createdAt: Date;
}

// ---------- Bots ----------
export type BotPlatform = 'telegram' | 'whatsapp' | 'discord' | 'instagram';
export type BotStatus = 'online' | 'offline' | 'error';

export interface Bot {
  id: string;
  name: string;
  platform: BotPlatform;
  username: string;
  clientId: string;
  projectId?: string;
  status: BotStatus;
  hostingService?: 'northflank' | 'railway' | 'custom';
  hostingId?: string;
  config: BotConfig;
  stats: BotStats;
  lastActive?: Date;
  createdAt: Date;
}

export interface BotConfig {
  welcomeMessage?: string;
  aiEnabled?: boolean;
  aiModel?: string;
  commands?: BotCommand[];
}

export interface BotCommand {
  command: string;
  description: string;
  response?: string;
}

export interface BotStats {
  totalMessages: number;
  totalUsers: number;
  errorsCount: number;
}

// ---------- Heartbeat ----------
export interface HeartbeatPayload {
  botId: string;
  status: 'ok' | 'warning' | 'error';
  uptime: number;
  memoryUsage?: {
    heapUsed: number;
    rss: number;
  };
  customMeta?: Record<string, any>;
}

export interface HeartbeatStatus {
  status: 'online' | 'offline';
  lastPing: string | null;
  meta?: any;
}

// ---------- Workflows ----------
export interface Workflow {
  id: string;
  externalId: string; // n8n workflow ID
  name: string;
  description?: string;
  clientId?: string;
  isActive: boolean;
  lastRun?: Date;
  lastRunStatus?: 'success' | 'error';
  createdAt: Date;
}

export interface Scenario {
  id: string;
  externalId: string; // Make.com scenario ID
  name: string;
  description?: string;
  clientId?: string;
  isActive: boolean;
  lastRun?: Date;
  lastRunStatus?: 'success' | 'error';
  createdAt: Date;
}

// ---------- Projects ----------
export type ProjectStatus = 'discovery' | 'development' | 'delivered' | 'support';

export interface Project {
  id: string;
  clientId: string;
  name: string;
  description?: string;
  status: ProjectStatus;
  price: number;
  startDate: Date;
  deliveryDate?: Date;
  supportUntil?: Date;
  bots: string[];
  workflows: string[];
  createdAt: Date;
}

// ---------- Tickets ----------
export type TicketStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type TicketPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface Ticket {
  id: string;
  clientId: string;
  subject: string;
  status: TicketStatus;
  priority: TicketPriority;
  createdAt: Date;
  updatedAt: Date;
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  authorType: 'client' | 'admin';
  authorId: string;
  message: string;
  createdAt: Date;
}

// ---------- Billing ----------
export type InvoiceStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface Invoice {
  id: string;
  clientId: string;
  projectId?: string;
  amount: number;
  description: string;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  createdAt: Date;
}

// ---------- API Responses ----------
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
