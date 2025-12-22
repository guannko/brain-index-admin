import { LucideIcon } from 'lucide-react';
import { cn } from '../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  color: 'green' | 'blue' | 'purple' | 'yellow' | 'red';
}

const colorMap = {
  green: 'bg-green-500/10 text-green-500',
  blue: 'bg-blue-500/10 text-blue-500',
  purple: 'bg-primary-500/10 text-primary-500',
  yellow: 'bg-yellow-500/10 text-yellow-500',
  red: 'bg-red-500/10 text-red-500',
};

export default function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-3xl font-bold text-white mt-1">{value}</p>
        </div>
        <div className={cn('p-3 rounded-lg', colorMap[color])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
