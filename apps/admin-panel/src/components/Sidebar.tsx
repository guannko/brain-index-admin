import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Bot,
  Users,
  Workflow,
  Server,
  Bell,
  Settings,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Bots', href: '/bots', icon: Bot },
  { name: 'Clients', href: '/clients', icon: Users },
  { name: 'Automations', href: '/automations', icon: Workflow },
  { name: 'Infrastructure', href: '/infrastructure', icon: Server },
  { name: 'Alerts', href: '/alerts', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-900 border-r border-gray-800">
      {/* Logo */}
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold tracking-tight">
          <span className="text-white">BR</span>
          <span className="text-amber-400 border-b-2 border-amber-400">AI</span>
          <span className="text-white">N </span>
          <span className="text-indigo-400">INDEX</span>
        </h1>
        <p className="text-xs text-gray-500 mt-1">Admin Panel</p>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800',
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
