import { useQuery } from '@tanstack/react-query';
import { Activity, Bot, Users, Workflow, AlertCircle, Building2, FolderKanban } from 'lucide-react';
import StatCard from '../components/StatCard';
import { clientsApi, Client } from '../lib/api';

export default function Dashboard() {
  // Fetch clients from API
  const { data: clients, isLoading: clientsLoading } = useQuery({
    queryKey: ['clients'],
    queryFn: clientsApi.getAll,
  });

  // Fetch bot statuses from heartbeat API
  const { data: botStatuses, isLoading: heartbeatLoading } = useQuery({
    queryKey: ['bot-statuses'],
    queryFn: async () => {
      const res = await fetch('http://localhost:3000/api/v1/heartbeat');
      return res.json();
    },
    refetchInterval: 10000,
  });

  const onlineBots = botStatuses
    ? Object.values(botStatuses).filter((b: any) => b.status === 'online').length
    : 0;

  const totalBots = clients?.reduce((sum, c) => sum + c.bots.length, 0) || 0;
  const totalProjects = clients?.reduce((sum, c) => sum + c.projects.length, 0) || 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary-400 to-cyan-400 bg-clip-text text-transparent">
          Brain Index Admin
        </h1>
        <p className="text-gray-400">Mission Control Center</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Active Clients"
          value={clientsLoading ? '...' : clients?.length || 0}
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Total Bots"
          value={clientsLoading ? '...' : totalBots}
          icon={Bot}
          color="green"
        />
        <StatCard
          title="Projects"
          value={clientsLoading ? '...' : totalProjects}
          icon={FolderKanban}
          color="purple"
        />
        <StatCard
          title="Bots Online"
          value={heartbeatLoading ? '...' : onlineBots}
          icon={Activity}
          color="yellow"
        />
      </div>

      {/* Clients Grid */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-primary-500" />
          Active Clients
        </h2>

        {clientsLoading ? (
          <p className="text-gray-400">Loading clients...</p>
        ) : clients && clients.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client: Client) => (
              <ClientCard key={client.id} client={client} />
            ))}
          </div>
        ) : (
          <p className="text-gray-400">No clients yet. Create your first client!</p>
        )}
      </div>

      {/* Bot Heartbeats */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Bot Heartbeats (Real-time)
        </h2>

        {heartbeatLoading ? (
          <p className="text-gray-400">Loading...</p>
        ) : botStatuses && Object.keys(botStatuses).length > 0 ? (
          <div className="space-y-2">
            {Object.entries(botStatuses).map(([botId, status]: [string, any]) => (
              <div
                key={botId}
                className="flex items-center justify-between p-3 bg-gray-800 rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-3 h-3 rounded-full ${
                      status.status === 'online' ? 'bg-green-500 animate-pulse' : 'bg-red-500'
                    }`}
                  />
                  <span className="text-white font-medium">{botId}</span>
                </div>
                <div className="text-sm text-gray-400">
                  {status.lastPing
                    ? `Last ping: ${new Date(status.lastPing).toLocaleTimeString()}`
                    : 'No data'}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-400">
            No bots connected via heartbeat. Start a bot with heartbeat enabled.
          </p>
        )}
      </div>
    </div>
  );
}

// Client Card Component
function ClientCard({ client }: { client: Client }) {
  const statusColors = {
    ACTIVE: 'bg-green-500/10 text-green-400 border-green-500/20',
    LEAD: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    PAUSED: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
    CHURNED: 'bg-red-500/10 text-red-400 border-red-500/20',
  };

  const onlineBots = client.bots.filter(b => b.isOnline).length;

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-primary-500/50 transition-all shadow-lg hover:shadow-primary-500/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-white">{client.name}</h3>
          <div className="flex items-center gap-1 text-gray-400 text-sm mt-1">
            <Building2 className="w-3 h-3" />
            {client.company || 'Individual'}
          </div>
        </div>
        <span className={`px-2 py-1 text-xs rounded-full border ${statusColors[client.status]}`}>
          {client.status}
        </span>
      </div>

      <div className="space-y-3">
        <div className="p-3 bg-gray-950 rounded-lg border border-gray-800/50">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-gray-500">Projects</span>
            <span className="font-mono text-primary-300">{client.projects.length}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-500">Bots</span>
            <span className="font-mono text-cyan-300">
              {onlineBots}/{client.bots.length} online
            </span>
          </div>
        </div>

        {client.bots.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {client.bots.map(bot => (
              <span
                key={bot.id}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-full ${
                  bot.isOnline
                    ? 'bg-green-500/10 text-green-400'
                    : 'bg-gray-800 text-gray-500'
                }`}
              >
                <Bot className="w-3 h-3" />
                {bot.name}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
