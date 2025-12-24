import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useState } from 'react';
import { Plus, MessageSquare, Clock, CheckCircle, AlertCircle, ChevronDown, Send } from 'lucide-react';

const statusConfig: Record<string, { color: string; icon: any; label: string }> = {
  OPEN: { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Clock, label: 'Open' },
  IN_PROGRESS: { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: MessageSquare, label: 'In Progress' },
  RESOLVED: { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle, label: 'Resolved' },
  CLOSED: { color: 'text-gray-400 bg-gray-400/10 border-gray-400/20', icon: CheckCircle, label: 'Closed' },
};

const priorityColors: Record<string, string> = {
  LOW: 'text-gray-400',
  NORMAL: 'text-blue-400',
  HIGH: 'text-amber-400',
  URGENT: 'text-red-400',
};

export default function Support() {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');

  const { data: tickets, isLoading } = useQuery({
    queryKey: ['tickets'],
    queryFn: async () => (await api.get('/portal/tickets')).data,
  });

  const createTicket = useMutation({
    mutationFn: async (data: { subject: string; description: string }) => {
      return (await api.post('/portal/tickets', data)).data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tickets'] });
      setShowForm(false);
      setSubject('');
      setDescription('');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (subject.trim()) {
      createTicket.mutate({ subject, description });
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Support</h1>
          <p className="text-slate-400">Get help with your bots</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Ticket
        </button>
      </div>

      {/* New Ticket Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Create New Ticket</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Subject</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="What do you need help with?"
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Description (optional)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide more details..."
                rows={4}
                className="w-full px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={createTicket.isPending}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                {createTicket.isPending ? 'Sending...' : 'Submit Ticket'}
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Tickets List */}
      <div className="space-y-4">
        {tickets?.length === 0 ? (
          <div className="text-center py-12 bg-gray-900 rounded-xl border border-gray-800">
            <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No tickets yet</h3>
            <p className="text-gray-400">Create a ticket if you need help</p>
          </div>
        ) : (
          tickets?.map((ticket: any) => {
            const status = statusConfig[ticket.status] || statusConfig.OPEN;
            const StatusIcon = status.icon;
            return (
              <div
                key={ticket.id}
                className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-xs text-gray-500 font-mono">#{ticket.id.slice(0, 8)}</span>
                      <span className={`text-xs font-medium ${priorityColors[ticket.priority]}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <h3 className="text-white font-medium mb-1">{ticket.subject}</h3>
                    {ticket.description && (
                      <p className="text-sm text-gray-400 line-clamp-2">{ticket.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      Created: {new Date(ticket.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border ${status.color}`}>
                    <StatusIcon className="w-3 h-3" />
                    {status.label}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Quick Contact */}
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Need immediate help?</h3>
        <div className="flex gap-4">
          <a
            href="https://t.me/brain_idx_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <Send className="w-5 h-5" />
            Message on Telegram
          </a>
          <a
            href="mailto:hello@brain-index.com"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-700 hover:border-gray-600 text-white rounded-lg transition-colors"
          >
            <MessageSquare className="w-5 h-5" />
            Send Email
          </a>
        </div>
      </div>
    </div>
  );
}
