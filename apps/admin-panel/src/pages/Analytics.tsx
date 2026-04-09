import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Check, X, Pencil } from 'lucide-react'
import { supabase, type AnalyticsIntegration } from '../lib/supabase'

const TOOL_EMOJI: Record<string, string> = {
  'google-analytics': '📊',
  'search-console': '🔍',
  'yandex-metrika': '📈',
  'yandex-webmaster': '🌐',
  'ms-clarity': '🎯',
  'bing-webmaster': '🔎',
}

export default function Analytics() {
  const { t } = useTranslation()
  const [tools, setTools] = useState<AnalyticsIntegration[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')

  useEffect(() => { void loadTools() }, [])

  async function loadTools() {
    setLoading(true)
    const { data } = await supabase.from('analytics_integrations').select('*').order('name')
    setTools((data as AnalyticsIntegration[]) || [])
    setLoading(false)
  }

  async function saveId(id: string) {
    await supabase
      .from('analytics_integrations')
      .update({ tracking_id: editValue || null })
      .eq('id', id)
    setEditing(null)
    void loadTools()
  }

  async function toggleActive(tool: AnalyticsIntegration) {
    await supabase
      .from('analytics_integrations')
      .update({ is_active: !tool.is_active })
      .eq('id', tool.id)
    void loadTools()
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">{t('nav.analytics')}</h1>
        <p className="text-gray-400 text-sm mt-1">{t('analytics.subtitle')}</p>
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-12">{t('common.loading')}</div>
      ) : tools.length === 0 ? (
        <div className="text-center text-gray-500 py-16">
          <p className="text-lg">{t('analytics.noTools')}</p>
          <p className="text-sm mt-2 text-gray-600">{t('analytics.runMigration')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {tools.map(tool => (
            <div key={tool.id} className="bg-gray-900 rounded-xl border border-gray-800 p-5">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{TOOL_EMOJI[tool.name] ?? '📊'}</span>
                  <div>
                    <h3 className="text-white font-semibold">{tool.display_name}</h3>
                    <p className="text-gray-500 text-xs mt-0.5">{tool.site}</p>
                  </div>
                </div>
                <button
                  onClick={() => void toggleActive(tool)}
                  title={tool.is_active ? 'Активно' : 'Отключено'}
                  className={`p-1.5 rounded-full transition-colors ${
                    tool.is_active
                      ? 'bg-green-900 text-green-300'
                      : 'bg-gray-800 text-gray-500 hover:bg-gray-700'
                  }`}
                >
                  {tool.is_active ? <Check size={14} /> : <X size={14} />}
                </button>
              </div>

              <div>
                <p className="text-xs text-gray-400 mb-1.5">{t('analytics.trackingId')}</p>
                {editing === tool.id ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      placeholder="G-XXXXXXXXXX"
                      className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-primary-500"
                    />
                    <button
                      onClick={() => void saveId(tool.id)}
                      className="px-3 py-1.5 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700"
                    >
                      <Check size={14} />
                    </button>
                    <button
                      onClick={() => setEditing(null)}
                      className="px-3 py-1.5 bg-gray-800 text-gray-400 rounded-lg text-sm hover:bg-gray-700"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => { setEditing(tool.id); setEditValue(tool.tracking_id ?? '') }}
                    className="w-full text-left flex items-center justify-between px-3 py-1.5 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-400 hover:border-gray-600 transition-colors"
                  >
                    <span>{tool.tracking_id ?? t('analytics.notSet')}</span>
                    <Pencil size={12} className="opacity-50 shrink-0" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
