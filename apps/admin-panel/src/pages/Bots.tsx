import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DataTable } from '../components/DataTable';
import { MoreVertical, User, Plus } from 'lucide-react';

export default function Bots() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-bots'],
    queryFn: async () => (await api.get('/admin/bots')).data
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Bots Management</h1>
          <p className="text-slate-400">Monitor and manage all deployed bots</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Deploy Bot
        </button>
      </div>

      <DataTable 
        isLoading={isLoading}
        data={data || []}
        emptyMessage="No bots deployed yet"
        columns={[
          {
            header: 'Bot Name',
            render: (bot: any) => (
              <div>
                <div className="font-medium text-white">{bot.name}</div>
                <div className="text-xs text-indigo-400">{bot.username || '@bot'}</div>
              </div>
            )
          },
          {
            header: 'Owner',
            render: (bot: any) => (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-slate-500" />
                <div>
                  <div className="text-sm text-white">{bot.client?.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-500">{bot.client?.company || 'Private'}</div>
                </div>
              </div>
            )
          },
          {
            header: 'Platform',
            render: (bot: any) => (
              <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                bot.platform === 'TELEGRAM' 
                  ? 'bg-blue-500/10 text-blue-400' 
                  : bot.platform === 'WHATSAPP'
                  ? 'bg-green-500/10 text-green-400'
                  : 'bg-indigo-500/10 text-indigo-400'
              }`}>
                {bot.platform}
              </span>
            )
          },
          {
            header: 'Status',
            render: (bot: any) => (
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${
                  bot.isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-slate-500'
                }`} />
                <span className={bot.isOnline ? 'text-emerald-400' : 'text-slate-400'}>
                  {bot.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            )
          },
          {
            header: 'Last Ping',
            render: (bot: any) => (
              <span className="text-xs text-slate-500 font-mono">
                {bot.lastPing ? new Date(bot.lastPing).toLocaleTimeString() : 'Never'}
              </span>
            )
          },
          {
            header: 'Actions',
            width: '50px',
            render: () => (
              <button className="p-2 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                <MoreVertical className="w-4 h-4" />
              </button>
            )
          }
        ]}
      />
    </div>
  );
}
