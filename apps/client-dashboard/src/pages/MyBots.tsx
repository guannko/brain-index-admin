import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Bot, Settings, Activity, Terminal, Plus } from 'lucide-react';
import { OnlineStatus, PlatformBadge } from '../components/StatusBadge';

export default function MyBots() {
  const { data: bots, isLoading, error } = useQuery({
    queryKey: ['my-bots'],
    queryFn: async () => (await api.get('/portal/bots')).data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 p-4 bg-red-500/10 rounded-lg border border-red-500/20">
        Error loading bots. Please try again.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">My Bots</h1>
          <p className="text-slate-400">Manage your AI assistants</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Request New Bot
        </button>
      </div>

      {/* Bots Grid */}
      <div className="grid gap-4">
        {bots?.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
            <Bot className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No bots yet</h3>
            <p className="text-gray-400 mb-4">Request your first bot to get started</p>
            <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">
              Request Bot
            </button>
          </div>
        ) : (
          bots?.map((bot: any) => (
            <div
              key={bot.id}
              className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all"
            >
              <div className="flex justify-between items-start">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-800 rounded-lg flex items-center justify-center">
                    <Bot className="w-6 h-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{bot.name}</h3>
                    <p className="text-indigo-400 text-sm">{bot.username || '@bot'}</p>
                    <div className="mt-2 flex gap-2">
                      <OnlineStatus isOnline={bot.isOnline} />
                      <PlatformBadge platform={bot.platform} />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="p-2 hover:bg-gray-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Logs"
                  >
                    <Terminal className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Stats"
                  >
                    <Activity className="w-5 h-5" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-800 rounded-lg text-slate-400 hover:text-white transition-colors"
                    title="Settings"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-4 border-t border-gray-800 pt-4">
                <div>
                  <p className="text-xs text-slate-500">Messages Today</p>
                  <p className="text-white font-mono">{bot.stats?.messagesToday || 0}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Uptime</p>
                  <p className="text-emerald-400 font-mono">{bot.stats?.uptime || 99.9}%</p>
                </div>
                <div>
                  <p className="text-xs text-slate-500">Last Activity</p>
                  <p className="text-slate-300">{bot.stats?.lastActivity || 'N/A'}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
