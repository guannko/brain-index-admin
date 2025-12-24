import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DataTable } from '../components/DataTable';
import { MoreVertical, Play, Pause, Plus, Workflow } from 'lucide-react';

export default function Automations() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-automations'],
    queryFn: async () => (await api.get('/admin/automations')).data
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Automations</h1>
          <p className="text-slate-400">n8n & Make.com workflows</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          New Automation
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400">Total Workflows</p>
          <p className="text-2xl font-bold text-white">{data?.length || 0}</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400">Active</p>
          <p className="text-2xl font-bold text-emerald-400">
            {data?.filter((a: any) => a.status === 'ACTIVE').length || 0}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400">Paused</p>
          <p className="text-2xl font-bold text-amber-400">
            {data?.filter((a: any) => a.status === 'PAUSED').length || 0}
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
          <p className="text-sm text-slate-400">Errors</p>
          <p className="text-2xl font-bold text-red-400">
            {data?.filter((a: any) => a.status === 'ERROR').length || 0}
          </p>
        </div>
      </div>

      <DataTable 
        isLoading={isLoading}
        data={data || []}
        emptyMessage="No automations configured"
        columns={[
          {
            header: 'Workflow',
            render: (auto: any) => (
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${
                  auto.platform === 'n8n' ? 'bg-orange-500/10' : 'bg-purple-500/10'
                }`}>
                  <Workflow className={`w-5 h-5 ${
                    auto.platform === 'n8n' ? 'text-orange-400' : 'text-purple-400'
                  }`} />
                </div>
                <div>
                  <div className="font-medium text-white">{auto.name}</div>
                  <div className="text-xs text-slate-500">{auto.externalId || 'No ID'}</div>
                </div>
              </div>
            )
          },
          {
            header: 'Platform',
            render: (auto: any) => (
              <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                auto.platform === 'n8n' 
                  ? 'bg-orange-500/10 text-orange-400' 
                  : 'bg-purple-500/10 text-purple-400'
              }`}>
                {auto.platform}
              </span>
            )
          },
          {
            header: 'Client',
            render: (auto: any) => (
              <span className="text-sm text-slate-400">
                {auto.client?.name || 'System'}
              </span>
            )
          },
          {
            header: 'Status',
            render: (auto: any) => (
              <span className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${
                auto.status === 'ACTIVE' 
                  ? 'bg-emerald-500/10 text-emerald-400' 
                  : auto.status === 'PAUSED'
                  ? 'bg-amber-500/10 text-amber-400'
                  : 'bg-red-500/10 text-red-400'
              }`}>
                {auto.status === 'ACTIVE' ? <Play className="w-3 h-3" /> : <Pause className="w-3 h-3" />}
                {auto.status}
              </span>
            )
          },
          {
            header: 'Runs Today',
            render: (auto: any) => (
              <span className="text-white font-mono">{auto.runsToday || 0}</span>
            )
          },
          {
            header: 'Success Rate',
            render: (auto: any) => (
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${
                      auto.successRate >= 95 ? 'bg-emerald-500' : 
                      auto.successRate >= 80 ? 'bg-amber-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${auto.successRate || 0}%` }}
                  />
                </div>
                <span className="text-xs text-slate-400">{auto.successRate?.toFixed(1) || 0}%</span>
              </div>
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
