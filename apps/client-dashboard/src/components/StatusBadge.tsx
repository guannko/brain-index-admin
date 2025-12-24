import { useQuery } from '@tanstack/react-query';
import { api } from '../lib/api';

interface StatusBadgeProps {
  botId: string;
  showLabel?: boolean;
}

export function StatusBadge({ botId, showLabel = true }: StatusBadgeProps) {
  // We could poll heartbeat status here, but for now use the bot data from parent
  // This component is mainly for visual consistency
  return null; // Status is shown inline in bot cards
}

export function OnlineStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-full ${
        isOnline
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-gray-500/10 text-gray-400 border border-gray-500/20'
      }`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-gray-400'
        }`}
      />
      {isOnline ? 'Online' : 'Offline'}
    </span>
  );
}

export function PlatformBadge({ platform }: { platform: string }) {
  const colors: Record<string, string> = {
    TELEGRAM: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    WHATSAPP: 'bg-green-500/10 text-green-400 border-green-500/20',
    DISCORD: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  };

  return (
    <span
      className={`text-xs px-2 py-0.5 rounded border uppercase font-medium ${
        colors[platform] || 'bg-gray-500/10 text-gray-400 border-gray-500/20'
      }`}
    >
      {platform}
    </span>
  );
}
