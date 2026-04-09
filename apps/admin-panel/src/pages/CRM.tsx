import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UserPlus, Users, TrendingUp } from 'lucide-react'
import { supabase, type CrmClient, type CrmDeal } from '../lib/supabase'

const STAGES = ['lead', 'qualified', 'proposal', 'negotiation', 'won', 'lost'] as const
type Stage = typeof STAGES[number]

const STAGE_COLORS: Record<Stage, string> = {
  lead: 'bg-gray-600',
  qualified: 'bg-blue-700',
  proposal: 'bg-purple-700',
  negotiation: 'bg-yellow-700',
  won: 'bg-green-700',
  lost: 'bg-red-700',
}

type ClientStatus = CrmClient['status']
const STATUS_COLORS: Record<ClientStatus, string> = {
  lead: 'bg-blue-900 text-blue-300',
  active: 'bg-green-900 text-green-300',
  paused: 'bg-yellow-900 text-yellow-300',
  churned: 'bg-red-900 text-red-300',
}

export default function CRM() {
  const { t } = useTranslation()
  const [tab, setTab] = useState<'contacts' | 'pipeline'>('contacts')
  const [clients, setClients] = useState<CrmClient[]>([])
  const [deals, setDeals] = useState<CrmDeal[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', company: '', phone: '' })

  useEffect(() => { void loadData() }, [])

  async function loadData() {
    setLoading(true)
    const [{ data: c }, { data: d }] = await Promise.all([
      supabase.from('crm_clients').select('*').order('created_at', { ascending: false }),
      supabase.from('crm_deals').select('*').order('created_at', { ascending: false }),
    ])
    setClients((c as CrmClient[]) || [])
    setDeals((d as CrmDeal[]) || [])
    setLoading(false)
  }

  async function addClient() {
    if (!form.name.trim()) return
    await supabase.from('crm_clients').insert([{ ...form, status: 'lead' }])
    setForm({ name: '', email: '', company: '', phone: '' })
    setShowModal(false)
    void loadData()
  }

  const stats = [
    { label: t('crm.totalClients'), value: clients.length, Icon: Users },
    { label: t('crm.activeDeals'), value: deals.filter(d => !['won', 'lost'].includes(d.stage)).length, Icon: TrendingUp },
    { label: t('crm.wonDeals'), value: deals.filter(d => d.stage === 'won').length, Icon: TrendingUp },
  ]

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-white">{t('nav.crm')}</h1>
          <p className="text-gray-400 text-sm mt-1">{t('crm.subtitle')}</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-sm font-medium"
        >
          <UserPlus size={16} />
          {t('crm.addClient')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {stats.map(({ label, value, Icon }) => (
          <div key={label} className="bg-gray-900 rounded-xl p-4 border border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary-600/20 rounded-lg">
                <Icon size={18} className="text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{value}</p>
                <p className="text-gray-400 text-xs">{label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-1 mb-6 bg-gray-900 p-1 rounded-lg w-fit">
        {(['contacts', 'pipeline'] as const).map(key => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              tab === key ? 'bg-primary-600 text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            {t(`crm.${key}`)}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-gray-400 text-center py-12">{t('common.loading')}</div>
      ) : tab === 'contacts' ? (
        <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-800">
                {[t('crm.name'), t('crm.company'), t('crm.email'), t('crm.status')].map(h => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-medium text-gray-400 uppercase tracking-wider">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clients.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center text-gray-500 py-8">{t('crm.noClients')}</td>
                </tr>
              ) : clients.map(client => (
                <tr key={client.id} className="border-b border-gray-800 hover:bg-gray-800/50 transition-colors">
                  <td className="px-4 py-3 text-white font-medium">{client.name}</td>
                  <td className="px-4 py-3 text-gray-400">{client.company ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-400">{client.email ?? '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${STATUS_COLORS[client.status]}`}>
                      {t(`crm.status_${client.status}`)}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid grid-cols-6 gap-3">
          {STAGES.map(stage => (
            <div key={stage} className="bg-gray-900 rounded-xl border border-gray-800 p-3">
              <div className={`text-xs font-semibold uppercase mb-3 px-2 py-1 rounded ${STAGE_COLORS[stage]} text-white w-fit`}>
                {t(`crm.stage_${stage}`)}
              </div>
              <div className="space-y-2">
                {deals.filter(d => d.stage === stage).map(deal => (
                  <div key={deal.id} className="bg-gray-800 rounded-lg p-2">
                    <p className="text-white text-xs font-medium">{deal.title}</p>
                    <p className="text-gray-400 text-xs mt-1">{deal.value} {deal.currency}</p>
                  </div>
                ))}
                {deals.filter(d => d.stage === stage).length === 0 && (
                  <p className="text-gray-600 text-xs text-center py-2">—</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 w-full max-w-md mx-4">
            <h2 className="text-lg font-bold text-white mb-4">{t('crm.addClient')}</h2>
            <div className="space-y-3">
              {([
                { field: 'name' as const, label: t('crm.name'), required: true },
                { field: 'company' as const, label: t('crm.company') },
                { field: 'email' as const, label: t('crm.email') },
                { field: 'phone' as const, label: t('crm.phone') },
              ]).map(({ field, label, required }) => (
                <div key={field}>
                  <label className="text-xs text-gray-400 mb-1 block">
                    {label}{required && ' *'}
                  </label>
                  <input
                    type="text"
                    value={form[field]}
                    onChange={e => setForm(prev => ({ ...prev, [field]: e.target.value }))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-primary-500"
                  />
                </div>
              ))}
            </div>
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 bg-gray-800 text-gray-300 rounded-lg text-sm hover:bg-gray-700 transition-colors"
              >
                {t('common.cancel')}
              </button>
              <button
                onClick={() => void addClient()}
                className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg text-sm hover:bg-primary-700 transition-colors"
              >
                {t('common.save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
