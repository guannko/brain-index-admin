import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { AlertTriangle, Info, CheckCircle, XCircle, Bell, BellOff } from 'lucide-react';

const alertConfig: Record<string, { icon: any; color: string; bg: string }> = {
  error: { icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/20' },
  warning: { icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10 border-amber-500/20' },
  info: { icon: Info, color: 'text-blue-400', bg: 'bg-blue-500/10 border-blue-500/20' },
  success: { icon: CheckCircle, color: 'text-emerald-400', bg: 'bg-emerald-500/10 border-emerald-500/20' },
};

export default function Alerts() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-alerts'],
    queryFn: async () => (await api.get('/admin/alerts')).data,
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const unacknowledged = data?.filter((a: any) => !a.acknowledged) || [];
  const acknowledged = data?.filter((a: any) => a.acknowledged) || [];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Alerts</h1>
          <p className="text-slate-400">Monitor system events and notifications</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-lg">
          <Bell className="w-4 h-4 text-amber-400" />
          <span className="text-white font-bold">{unacknowledged.length}</span>
          <span className="text-slate-400 text-sm">unread</span>
        </div>
      </div>

      {/* Active Alerts */}
      {unacknowledged.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Active Alerts
          </h2>
          <div className="space-y-3">
            {unacknowledged.map((alert: any) => {
              const config = alertConfig[alert.type] || alertConfig.info;
              const Icon = config.icon;
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border ${config.bg} flex items-start gap-4`}
                >
                  <Icon className={`w-6 h-6 ${config.color} flex-shrink-0 mt-0.5`} />
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-white">{alert.title}</h3>
                        <p className="text-sm text-slate-400 mt-1">{alert.message}</p>
                      </div>
                      <button className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
                        Acknowledge
                      </button>
                    </div>
                    <div className="flex gap-4 mt-3 text-xs text-slate-500">
                      <span>Service: {alert.service}</span>
                      <span>•</span>
                      <span>{new Date(alert.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Acknowledged Alerts */}
      {acknowledged.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-400 flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Acknowledged
          </h2>
          <div className="space-y-2 opacity-60">
            {acknowledged.map((alert: any) => {
              const config = alertConfig[alert.type] || alertConfig.info;
              const Icon = config.icon;
              return (
                <div 
                  key={alert.id}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center gap-3"
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <div className="flex-1">
                    <span className="text-white text-sm">{alert.title}</span>
                    <span className="text-slate-500 text-xs ml-2">— {alert.service}</span>
                  </div>
                  <span className="text-xs text-slate-600">
                    {new Date(alert.timestamp).toLocaleDateString()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {data?.length === 0 && (
        <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">All Clear!</h3>
          <p className="text-slate-400">No alerts at this time</p>
        </div>
      )}
    </div>
  );
}
