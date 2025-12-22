import { useQuery } from '@tanstack/react-query';
import { Activity, Bot, Users, Workflow, AlertCircle } from 'lucide-react';
import StatCard from '../components/StatCard';

export default function Dashboard() {
  // Fetch bot statuses from heartbeat API
  const { data: botStatuses, isLoading } = useQuery({
    queryKey: ['bot-statuses'],
    queryFn: async () => {
      const res = await fetch('/api/v1/heartbeat');
      return res.json();
    },
    refetchInterval: 10000, // Refresh every 10 seconds
  });

  const onlineBots = botStatuses
    ? Object.values(botStatuses).filter((b: any) => b.status === 'online').length
    : 0;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400">Welcome to Brain Index Admin Panel</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Bots Online"
          value={isLoading ? '...' : onlineBots}
          icon={Bot}
          color="green"
        />
        <StatCard
          title="Active Clients"
          value="--"
          icon={Users}
          color="blue"
        />
        <StatCard
          title="Workflows"
          value="--"
          icon={Workflow}
          color="purple"
        />
        <StatCard
          title="Alerts"
          value="0"
          icon={AlertCircle}
          color="yellow"
        />
      </div>

      {/* Bot Status Table */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary-500" />
          Bot Heartbeats (Real-time)
        </h2>

        {isLoading ? (
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
                      status.status === 'online' ? 'bg-green-500' : 'bg-red-500'
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
            No bots connected. Start a bot with heartbeat enabled to see it here.
          </p>
        )}
      </div>
    </div>
  );
}
