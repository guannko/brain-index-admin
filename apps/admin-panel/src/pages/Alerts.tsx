import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { AlertTriangle, Info, CheckCircle, Bell, XCircle, BellOff, RefreshCw } from 'lucide-react';

type AlertType = 'CRITICAL' | 'WARNING' | 'INFO';

interface Alert {
  id: string;
  type: AlertType;
  message: string;
  source: string;
  isRead: boolean;
  createdAt: string;
}

const alertConfig: Record<AlertType, { icon: any; color: string; bg: string; border: string }> = {
  CRITICAL: { 
    icon: XCircle, 
    color: 'text-red-400', 
    bg: 'bg-red-500/10', 
    border: 'border-l-red-500' 
  },
  WARNING: { 
    icon: AlertTriangle, 
    color: 'text-amber-400', 
    bg: 'bg-amber-500/10', 
    border: 'border-l-amber-500' 
  },
  INFO: { 
    icon: Info, 
    color: 'text-blue-400', 
    bg: 'bg-blue-500/10', 
    border: 'border-l-blue-500' 
  },
};

export default function Alerts() {
  const queryClient = useQueryClient();

  const { data: alerts, isLoading, refetch } = useQuery({
    queryKey: ['admin-alerts'],
    queryFn: async () => (await api.get<Alert[]>('/admin/alerts')).data,
    refetchInterval: 60000,
  });

  const markReadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/admin/alerts/${id}/read`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
  });

  const markUnreadMutation = useMutation({
    mutationFn: async (id: string) => api.patch(`/admin/alerts/${id}/unread`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-alerts'] })
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const unreadAlerts = alerts?.filter(a => !a.isRead) || [];
  const readAlerts = alerts?.filter(a => a.isRead) || [];
  const criticalCount = unreadAlerts.filter(a => a.type === 'CRITICAL').length;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-indigo-400" /> System Alerts
          </h1>
          <p className="text-slate-400">Monitor critical system events</p>
        </div>
        <div className="flex items-center gap-3">
          {criticalCount > 0 && (
            <span className="px-3 py-1 bg-red-500/10 text-red-400 rounded-full text-xs font-bold border border-red-500/20 animate-pulse">
              {criticalCount} Critical
            </span>
          )}
          <span className="px-3 py-1 bg-slate-800 text-white rounded-full text-sm">
            {unreadAlerts.length} unread
          </span>
          <button 
            onClick={() => refetch()}
            className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Active Alerts */}
      {unreadAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Bell className="w-5 h-5 text-amber-400" />
            Active Alerts
          </h2>
          <div className="space-y-3">
            {unreadAlerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              return (
                <div 
                  key={alert.id}
                  className={`p-4 rounded-xl border border-slate-700 ${config.bg} border-l-4 ${config.border} flex items-start gap-4 shadow-lg`}
                >
                  <div className={`p-2 rounded-lg ${config.bg}`}>
                    <Icon className={`w-6 h-6 ${config.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-bold text-white">{alert.source}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.bg} ${config.color}`}>
                            {alert.type}
                          </span>
                        </div>
                        <p className="text-slate-300">{alert.message}</p>
                        <span className="text-xs text-slate-500 mt-2 block">
                          {new Date(alert.createdAt).toLocaleString()}
                        </span>
                      </div>
                      <button 
                        onClick={() => markReadMutation.mutate(alert.id)}
                        disabled={markReadMutation.isPending}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Acknowledge
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Acknowledged Alerts */}
      {readAlerts.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-slate-400 flex items-center gap-2">
            <BellOff className="w-5 h-5" />
            Acknowledged ({readAlerts.length})
          </h2>
          <div className="space-y-2 opacity-60">
            {readAlerts.map((alert) => {
              const config = alertConfig[alert.type];
              const Icon = config.icon;
              return (
                <div 
                  key={alert.id}
                  className="p-3 rounded-lg border border-slate-800 bg-slate-900/50 flex items-center gap-3 hover:opacity-100 transition-opacity"
                >
                  <Icon className={`w-5 h-5 ${config.color}`} />
                  <div className="flex-1">
                    <span className="text-white text-sm">{alert.message}</span>
                    <span className="text-slate-500 text-xs ml-2">— {alert.source}</span>
                  </div>
                  <span className="text-xs text-slate-600">
                    {new Date(alert.createdAt).toLocaleDateString()}
                  </span>
                  <button 
                    onClick={() => markUnreadMutation.mutate(alert.id)}
                    className="p-1.5 hover:bg-slate-800 rounded text-slate-500 hover:text-white transition-colors"
                    title="Mark as unread"
                  >
                    <Bell className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {alerts?.length === 0 && (
        <div className="text-center py-12 bg-slate-900 rounded-xl border border-slate-800">
          <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-white mb-2">All Clear!</h3>
          <p className="text-slate-400">No alerts at this time. System is healthy.</p>
        </div>
      )}
    </div>
  );
}
