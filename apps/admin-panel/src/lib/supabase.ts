import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(url || '', key || '')

// CRM
export interface CrmClient {
  id: string
  name: string
  email: string | null
  phone: string | null
  company: string | null
  status: 'lead' | 'active' | 'paused' | 'churned'
  source: string | null
  notes: string | null
  created_at: string
}

export interface CrmDeal {
  id: string
  client_id: string | null
  title: string
  stage: 'lead' | 'qualified' | 'proposal' | 'negotiation' | 'won' | 'lost'
  value: number
  currency: string
  notes: string | null
  expected_close: string | null
  created_at: string
}

export interface AnalyticsIntegration {
  id: string
  name: string
  display_name: string
  site: string
  tracking_id: string | null
  is_active: boolean
}

// Projects / Bots / Heartbeats
export interface Project {
  id: string
  number: string
  name: string
  handle: string | null
  description: string
  platform: string
  type: string
  color: string
  tags: string[]
  heartbeat_key: string | null
  is_active: boolean
  created_at: string
}

export interface Heartbeat {
  bot_id: string
  status: 'online' | 'offline'
  metadata: Record<string, unknown>
  pinged_at: string
}
