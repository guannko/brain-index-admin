import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Bot, Workflow, MessageSquare, Clock, Loader2 } from 'lucide-react';
import { portalApi, getClients, useClientStore, Bot as BotType } from '../lib/api';

export default function Overview() {
  const { clientId, clientName, setClient } = useClientStore();

  // First, load clients list and auto-select first one (demo mode)
  const { data: clients } = useQuery({
    queryKey: ['clients-list'],
    queryFn: getClients,
  });

  // Auto-select first client on load
  useEffect(() => {
    if (clients && clients.length > 0 && !clientId) {
      setClient(clients[0].id, clients[0].name);
    }
  }, [clients, clientId, setClient]);

  // Then load dashboard for selected client
  const { data, isLoading, error } = useQuery({
    queryKey: ['portal-dashboard', clientId],
    queryFn: portalApi.getDashboard,
    enabled: !!clientId,
  });

  if (!clientId || isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
        <span className="ml-3 text-gray-400">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
        Error loading dashboard. Please try again.
      </div>
    );
  }

  return (
    <div>
      {/* Client Selector (Demo Mode) */}
      {clients && clients.length > 1 && (
        <div className="mb-4 p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <span className="text-amber-400 text-sm">Demo Mode: </span>
          <select
            value={clientId}
            onChange={(e) => {
              const selected = clients.find(c => c.id === e.target.value);
              if (selected) setClient(selected.id, selected.name);
            }}
            className="ml-2 bg-gray-800 text-white text-sm rounded px-2 py-1 border border-gray-700"
          >
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name} ({c.company || 'Individual'})</option>
            ))}
          </select>
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, {data?.clientName?.split(' ')[0] || 'Client'}!</h1>
        <p className="text-gray-400">Here's what's happening with your bots</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Bots" value={data?.stats.activeBots || 0} icon={Bot} />
        <StatCard title="Automations" value={data?.stats.automations || 0} icon={Workflow} />
        <StatCard 
          title="Messages (30d)" 
          value={data?.stats.totalMessages?.toLocaleString() || '0'} 
          icon={MessageSquare} 
        />
        <StatCard title="Support Until" value={data?.stats.supportUntil || '-'} icon={Clock} />
      </div>

      {/* My Bots */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">My Bots</h2>
        {data?.bots && data.bots.length > 0 ? (
          <div className="space-y-3">
            {data.bots.map((bot) => (
              <BotCard key={bot.id} bot={bot} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No bots yet. Contact us to create your first bot!</p>
        )}
      </div>

      {/* Support CTA */}
      <div className="bg-gradient-to-r from-primary-900/50 to-primary-800/50 rounded-xl border border-primary-700 p-6">
        <h3 className="text-lg font-semibold text-white">Need Help?</h3>
        <p className="text-gray-300 mt-1">
          Our team is here to help. Create a support ticket or check our FAQ.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm font-medium transition-colors">
            Create Ticket
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string | number; icon: any }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-primary-500/10 text-primary-500">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function BotCard({ bot }: { bot: BotType }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">{bot.name}</p>
          <p className="text-sm text-gray-400">{bot.username || `@${bot.name.toLowerCase().replace(/\s+/g, '_')}`}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${bot.isOnline ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}
          />
          <span className={`text-sm ${bot.isOnline ? 'text-green-400' : 'text-gray-400'}`}>
            {bot.isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">{bot.platform}</p>
      </div>
    </div>
  );
}
