import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { type LucideIcon, Bot, Zap, CreditCard } from 'lucide-react'
import { heartbeatApi } from '../lib/api'

interface ProjectDef {
  id: string
  number: string
  name: string
  handle: string | null
  description: string
  platform: string
  type: string
  color: 'blue' | 'green' | 'purple'
  Icon: LucideIcon
  heartbeatKey: string | null
  tags: string[]
}

const COLOR: Record<string, { bg: string; text: string; badge: string }> = {
  blue:   { bg: 'bg-blue-600/10',   text: 'text-blue-400',   badge: 'bg-blue-900/50 text-blue-300' },
  green:  { bg: 'bg-green-600/10',  text: 'text-green-400',  badge: 'bg-green-900/50 text-green-300' },
  purple: { bg: 'bg-purple-600/10', text: 'text-purple-400', badge: 'bg-purple-900/50 text-purple-300' },
}

const PROJECTS: ProjectDef[] = [
  {
    id: 'brain-index-bot',
    number: '№1',
    name: 'Brain Index Bot',
    handle: '@brain_index_bot',
    description: 'Основной Telegram бот проекта Brain Index. Работает локально / деплой Northflank.',
    platform: 'Local / Northflank',
    type: 'Telegram Bot',
    color: 'blue',
    Icon: Bot,
    heartbeatKey: 'brain_index_bot',
    tags: ['Python', 'aiogram', 'Redis'],
  },
  {
    id: 'fitbot',
    number: '№2',
    name: 'FitBot v1',
    handle: null,
    description: 'Фитнес-бот — персональные тренировки, питание и статистика через Telegram. n8n + Supabase.',
    platform: 'n8n',
    type: 'n8n Workflow',
    color: 'green',
    Icon: Zap,
    heartbeatKey: null,
    tags: ['n8n', 'Supabase', 'Telegram'],
  },
  {
    id: 'stripe-recovery',
    number: '№3',
    name: 'Stripe Recovery',
    handle: null,
    description: 'Автоматическое восстановление потерянных платежей. Интеграция Gumroad + Stripe через n8n.',
    platform: 'n8n',
    type: 'n8n Workflow',
    color: 'purple',
    Icon: CreditCard,
    heartbeatKey: null,
    tags: ['n8n', 'Stripe', 'Gumroad'],
  },
]

export default function Projects() {
  const { t } = useTranslation()

  const { data: heartbeat } = useQuery({
    queryKey: ['bot-statuses'],
    queryFn: heartbeatApi.getAll,
    refetchInterval: 15000,
  })

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{t('nav.projects')}</h1>
        <p className="text-gray-400 text-sm mt-1">{t('projects.subtitle')}</p>
      </div>

      <div className="space-y-4">
        {PROJECTS.map(({ id, number, name, handle, description, platform, type, color, Icon, heartbeatKey, tags }) => {
          const c = COLOR[color]

          let statusDot = 'bg-gray-500'
          let statusLabel = t('projects.unknown')

          if (heartbeatKey !== null) {
            if (heartbeat) {
              const hb = heartbeat[heartbeatKey]
              const online = hb?.status === 'online'
              statusDot = online ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              statusLabel = online ? t('projects.online') : t('projects.offline')
            }
          } else {
            statusDot = 'bg-green-500 animate-pulse'
            statusLabel = 'n8n managed'
          }

          return (
            <div key={id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors">
              <div className="flex items-start gap-4">
                {/* Number */}
                <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-xs">{number}</span>
                </div>

                {/* Icon */}
                <div className={`flex-shrink-0 p-3 rounded-xl ${c.bg}`}>
                  <Icon size={22} className={c.text} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="text-lg font-bold text-white">{name}</h3>
                    {handle && (
                      <span className="text-sm text-gray-500">{handle}</span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.badge}`}>
                      {type}
                    </span>
                  </div>

                  <p className="text-gray-400 text-sm mb-4">{description}</p>

                  <div className="flex flex-wrap items-center gap-4">
                    {/* Platform */}
                    <span className="text-xs text-gray-500">
                      {t('projects.platform')}:{' '}
                      <span className="text-gray-300 font-medium">{platform}</span>
                    </span>

                    {/* Status */}
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
                      <span className="text-xs text-gray-400">{statusLabel}</span>
                    </div>

                    {/* Tags */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {tags.map(tag => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-800 rounded text-xs text-gray-400">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
