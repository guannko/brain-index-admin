import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { DataTable } from '../components/DataTable';
import { MoreVertical, Building2, Mail, Plus } from 'lucide-react';

export default function Clients() {
  const { data, isLoading } = useQuery({
    queryKey: ['admin-clients'],
    queryFn: async () => (await api.get('/clients')).data
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Clients Management</h1>
          <p className="text-slate-400">Manage all registered clients</p>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" />
          Add Client
        </button>
      </div>

      <DataTable 
        isLoading={isLoading}
        data={data || []}
        emptyMessage="No clients registered yet"
        columns={[
          {
            header: 'Client Name',
            render: (client: any) => (
              <div>
                <div className="font-medium text-white">{client.name}</div>
                <div className="text-xs text-slate-500">{client.phone || 'No phone'}</div>
              </div>
            )
          },
          {
            header: 'Company / Email',
            render: (client: any) => (
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2 text-xs text-slate-300">
                   <Building2 className="w-3 h-3" /> {client.company || 'Private'}
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                   <Mail className="w-3 h-3" /> {client.email}
                </div>
              </div>
            )
          },
          {
            header: 'Plan',
            render: (client: any) => (
              <span className={`px-2 py-1 rounded text-xs font-medium uppercase ${
                client.plan === 'enterprise' 
                  ? 'bg-amber-500/10 text-amber-400' 
                  : client.plan === 'business'
                  ? 'bg-indigo-500/10 text-indigo-400'
                  : 'bg-slate-700 text-slate-400'
              }`}>
                {client.plan || 'starter'}
              </span>
            )
          },
          {
            header: 'Status',
            render: (client: any) => (
              <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                client.status === 'ACTIVE' 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-slate-700 text-slate-400 border-slate-600'
              }`}>
                {client.status}
              </span>
            )
          },
          {
            header: 'Stats',
            render: (client: any) => (
               <div className="flex gap-4 text-xs font-mono">
                 <span className="text-indigo-400">PROJ: {client.projects?.length || 0}</span>
                 <span className="text-amber-400">BOTS: {client.bots?.length || 0}</span>
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
