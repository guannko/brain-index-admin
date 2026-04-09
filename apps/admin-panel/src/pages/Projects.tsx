import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { type LucideIcon, Bot, Zap, CreditCard } from 'lucide-react'
import { supabase, type Project, type Heartbeat } from '../lib/supabase'

const COLOR: Record<string, { bg: string; text: string; badge: string }> = {
  blue:   { bg: 'bg-blue-600/10',   text: 'text-blue-400',   badge: 'bg-blue-900/50 text-blue-300' },
  green:  { bg: 'bg-green-600/10',  text: 'text-green-400',  badge: 'bg-green-900/50 text-green-300' },
  purple: { bg: 'bg-purple-600/10', text: 'text-purple-400', badge: 'bg-purple-900/50 text-purple-300' },
}

const ICONS: Record<string, LucideIcon> = {
  'brain-index-bot': Bot,
  'fitbot': Zap,
  'stripe-recovery': CreditCard,
}

export default function Projects() {
  const { t } = useTranslation()
  const [projects, setProjects] = useState<Project[]>([])
  const [heartbeats, setHeartbeats] = useState<Record<string, Heartbeat>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void loadData()

    // Подписка Realtime — обновляет статус мгновенно
    const channel = supabase
      .channel('heartbeats-live')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'heartbeats' },
        (payload) => {
          const hb = payload.new as Heartbeat
          setHeartbeats(prev => ({ ...prev, [hb.bot_id]: hb }))
        }
      )
      .subscribe()

    return () => { void supabase.removeChannel(channel) }
  }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: proj }, { data: hbRows }] = await Promise.all([
      supabase.from('projects').select('*').eq('is_active', true).order('number'),
      supabase.from('heartbeats').select('*'),
    ])
    setProjects((proj as Project[]) || [])
    const hbMap = ((hbRows as Heartbeat[]) || []).reduce<Record<string, Heartbeat>>(
      (acc, h) => { acc[h.bot_id] = h; return acc },
      {}
    )
    setHeartbeats(hbMap)
    setLoading(false)
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{t('nav.projects')}</h1>
        <p className="text-gray-400 text-sm mt-1">{t('projects.subtitle')}</p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-12">{t('common.loading')}</div>
      ) : (
        <div className="space-y-4">
          {projects.map(project => {
            const c = COLOR[project.color] ?? COLOR['blue']
            const Icon = ICONS[project.id] ?? Bot
            const hb = project.heartbeat_key ? heartbeats[project.heartbeat_key] : null

            let statusDot: string
            let statusLabel: string
            let lastPing: string | null = null

            if (project.heartbeat_key === null) {
              // n8n workflow — всегда активен
              statusDot = 'bg-green-500 animate-pulse'
              statusLabel = 'n8n managed'
            } else if (hb) {
              statusDot = hb.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
              statusLabel = hb.status === 'online' ? t('projects.online') : t('projects.offline')
              if (hb.status === 'online') {
                lastPing = new Date(hb.pinged_at).toLocaleTimeString()
              }
            } else {
              statusDot = 'bg-gray-500'
              statusLabel = t('projects.unknown')
            }

            return (
              <div
                key={project.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-colors"
              >
                <div className="flex items-start gap-4">
                  {/* Номер */}
                  <div className="flex-shrink-0 w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center">
                    <span className="text-gray-400 font-bold text-xs">{project.number}</span>
                  </div>

                  {/* Иконка */}
                  <div className={`flex-shrink-0 p-3 rounded-xl ${c.bg}`}>
                    <Icon size={22} className={c.text} />
                  </div>

                  {/* Контент */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-white">{project.name}</h3>
                      {project.handle && (
                        <span className="text-sm text-gray-500">{project.handle}</span>
                      )}
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${c.badge}`}>
                        {project.type}
                      </span>
                    </div>

                    <p className="text-gray-400 text-sm mb-4">{project.description}</p>

                    <div className="flex flex-wrap items-center gap-4">
                      <span className="text-xs text-gray-500">
                        {t('projects.platform')}:{' '}
                        <span className="text-gray-300 font-medium">{project.platform}</span>
                      </span>

                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${statusDot}`} />
                        <span className="text-xs text-gray-400">{statusLabel}</span>
                        {lastPing && (
                          <span className="text-xs text-gray-600">· {lastPing}</span>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-1.5">
                        {project.tags.map(tag => (
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
      )}
    </div>
  )
}
