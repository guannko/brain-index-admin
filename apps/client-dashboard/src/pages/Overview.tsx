import { Bot, Workflow, MessageSquare, Clock } from 'lucide-react';

export default function Overview() {
  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Welcome back, John!</h1>
        <p className="text-gray-400">Here's what's happening with your bots</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="My Bots" value="2" icon={Bot} />
        <StatCard title="Automations" value="3" icon={Workflow} />
        <StatCard title="Messages (30d)" value="1,234" icon={MessageSquare} />
        <StatCard title="Support Until" value="Jan 15" icon={Clock} />
      </div>

      {/* My Bots */}
      <div className="bg-gray-900 rounded-xl border border-gray-800 p-6 mb-6">
        <h2 className="text-lg font-semibold text-white mb-4">My Bots</h2>
        <div className="space-y-3">
          <BotCard
            name="AI Fitness Coach"
            username="@fitness_ai_bot"
            status="online"
            messages={567}
          />
          <BotCard
            name="Support Assistant"
            username="@acme_support_bot"
            status="online"
            messages={123}
          />
        </div>
      </div>

      {/* Support CTA */}
      <div className="bg-gradient-to-r from-primary-900/50 to-primary-800/50 rounded-xl border border-primary-700 p-6">
        <h3 className="text-lg font-semibold text-white">Need Help?</h3>
        <p className="text-gray-300 mt-1">
          Our team is here to help. Create a support ticket or check our FAQ.
        </p>
        <div className="flex gap-3 mt-4">
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 rounded-lg text-white text-sm font-medium transition-colors">
            Create Ticket
          </button>
          <button className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white text-sm font-medium transition-colors">
            View FAQ
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon }: { title: string; value: string; icon: any }) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-primary-500/10 text-primary-500">
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}

function BotCard({
  name,
  username,
  status,
  messages,
}: {
  name: string;
  username: string;
  status: 'online' | 'offline';
  messages: number;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
          <Bot className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-white">{name}</p>
          <p className="text-sm text-gray-400">{username}</p>
        </div>
      </div>
      <div className="text-right">
        <div className="flex items-center gap-2">
          <span
            className={`w-2 h-2 rounded-full ${
              status === 'online' ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-sm text-gray-400 capitalize">{status}</span>
        </div>
        <p className="text-sm text-gray-500">{messages} messages</p>
      </div>
    </div>
  );
}
