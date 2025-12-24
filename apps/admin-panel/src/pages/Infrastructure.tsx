import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Database, Server, Activity, Workflow, Zap, RefreshCw } from 'lucide-react';

export default function Infrastructure() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['infra-health'],
    queryFn: async () => (await api.get('/admin/health')).data,
    refetchInterval: 30000, // Auto-refresh every 30s
  });

  const getIcon = (service: string) => {
    if (service.includes('SQL')) return Database;
    if (service.includes('Mongo')) return Database;
    if (service.includes('Redis')) return Activity;
    if (service.includes('n8n')) return Workflow;
    if (service.includes('Make')) return Zap;
    return Server;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">System Infrastructure</h1>
          <p className="text-slate-400">Real-time monitoring of core services</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data?.map((sys: any, idx: number) => {
          const Icon = getIcon(sys.service);
          return (
            <div 
              key={idx} 
              className="bg-slate-900 border border-slate-800 rounded-xl p-6 relative overflow-hidden group hover:border-slate-700 transition-all"
            >
              {/* Status Line */}
              <div className={`absolute top-0 left-0 w-1 h-full ${
                  sys.status === 'healthy' ? 'bg-emerald-500' : 'bg-amber-500'
              }`} />

              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    sys.status === 'healthy' ? 'bg-emerald-500/10' : 'bg-amber-500/10'
                  }`}>
                    <Icon className={`w-6 h-6 ${
                      sys.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'
                    }`} />
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{sys.service}</h3>
                    <span className={`text-xs uppercase font-bold ${
                       sys.status === 'healthy' ? 'text-emerald-400' : 'text-amber-400'
                    }`}>{sys.status}</span>
                  </div>
                </div>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-3 text-sm">
                  {Object.entries(sys.metrics).map(([key, val]: any) => (
                      <div key={key} className="bg-slate-950/50 p-3 rounded-lg border border-slate-800/50">
                          <span className="block text-slate-500 text-xs uppercase mb-1">{key}</span>
                          <span className="block text-white font-mono text-lg">{val}</span>
                      </div>
                  ))}
              </div>

              {/* CPU/Load Visualizer if exists */}
              {sys.metrics.cpu && (
                  <div className="mt-4">
                      <div className="flex justify-between text-xs text-slate-400 mb-1">
                          <span>Load</span>
                          <span>{sys.metrics.cpu}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <div 
                              className="h-full bg-indigo-500 rounded-full transition-all" 
                              style={{ width: sys.metrics.cpu }} 
                          />
                      </div>
                  </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
