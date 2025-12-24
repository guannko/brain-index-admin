import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Check, CreditCard, Download, Star } from 'lucide-react';

export default function Billing() {
  const { data, isLoading } = useQuery({
    queryKey: ['billing'],
    queryFn: async () => (await api.get('/portal/billing')).data,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  const statusColors: Record<string, string> = {
    PAID: 'text-emerald-400',
    PENDING: 'text-amber-400',
    OVERDUE: 'text-red-400',
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-slate-400">Manage your plan and invoices</p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Plan Card */}
        <div className="bg-gradient-to-br from-indigo-900/50 to-gray-900 border border-indigo-500/30 rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Star className="w-5 h-5 text-amber-400" />
              {data?.plan?.name || 'Business Plan'}
            </h3>
            <span className="bg-indigo-500 text-white text-xs px-2 py-1 rounded font-medium">Active</span>
          </div>

          <div className="text-3xl font-bold text-white mb-6">
            €{data?.plan?.price || 150}
            <span className="text-lg text-slate-400 font-normal">/month</span>
          </div>

          <ul className="space-y-3 mb-8">
            {(data?.plan?.features || []).map((feature: string, i: number) => (
              <li key={i} className="flex items-center gap-2 text-slate-300">
                <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-indigo-500/20 text-sm text-slate-400 mb-4">
            Next billing date: <span className="text-white">{data?.nextBilling || 'Jan 15, 2025'}</span>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
              Upgrade Plan
            </button>
            <button className="px-4 py-2 border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors">
              Manage
            </button>
          </div>
        </div>

        {/* Payment History */}
        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-4">Payment History</h3>
          <div className="space-y-4">
            {(data?.invoices || []).map((inv: any) => (
              <div
                key={inv.id}
                className="flex items-center justify-between p-3 bg-gray-950 rounded-lg border border-gray-800"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-900 rounded-lg text-slate-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Invoice #{inv.id}</p>
                    <p className="text-xs text-slate-500">{inv.date}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-4">
                  <div>
                    <p className="text-white font-bold">€{inv.amount}</p>
                    <span className={`text-xs uppercase font-bold ${statusColors[inv.status] || 'text-gray-400'}`}>
                      {inv.status}
                    </span>
                  </div>
                  <button className="p-2 hover:bg-gray-800 rounded-lg text-slate-400 hover:text-white transition-colors">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contact for Custom */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 text-center">
        <h3 className="text-lg font-semibold text-white mb-2">Need a custom solution?</h3>
        <p className="text-slate-400 mb-4">Contact us for enterprise pricing and custom development</p>
        <a
          href="https://t.me/brain_idx_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          Contact Sales
        </a>
      </div>
    </div>
  );
}
