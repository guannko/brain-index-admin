import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import { Save, Shield, Bell, Database, Key, User, Check, Loader2 } from 'lucide-react';

interface Settings {
  profile: { email: string; name: string };
  system: { maintenanceMode: boolean; debugLogs: boolean; backupFrequency: string; logRetention: number };
  notifications: { telegram: boolean; email: boolean; slack: boolean; alertThreshold: string };
  security: { twoFactorAuth: boolean; sessionTimeout: number };
}

export default function Settings() {
  const [localSettings, setLocalSettings] = useState<Settings | null>(null);
  const [saved, setSaved] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: async () => (await api.get<Settings>('/admin/settings')).data
  });

  const saveMutation = useMutation({
    mutationFn: async (settings: Settings) => api.post('/admin/settings', settings),
    onSuccess: () => {
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }
  });

  useEffect(() => {
    if (data) setLocalSettings(data);
  }, [data]);

  const handleSave = () => {
    if (localSettings) saveMutation.mutate(localSettings);
  };

  if (isLoading || !localSettings) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        <p className="text-slate-400">Configure system preferences</p>
      </div>

      {/* Profile Section */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <User className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Admin Profile</h2>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">Display Name</label>
            <input
              type="text"
              value={localSettings.profile.name}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                profile: { ...localSettings.profile, name: e.target.value }
              })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div className="space-y-2">
            <label className="block text-sm text-slate-400">Email Address</label>
            <input
              type="email"
              value={localSettings.profile.email}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                profile: { ...localSettings.profile, email: e.target.value }
              })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          <ToggleRow
            label="Email Alerts"
            description="Receive critical alerts via email"
            checked={localSettings.notifications.email}
            onChange={(v) => setLocalSettings({
              ...localSettings,
              notifications: { ...localSettings.notifications, email: v }
            })}
          />
          <ToggleRow
            label="Telegram Alerts"
            description="Get instant notifications via Telegram"
            checked={localSettings.notifications.telegram}
            onChange={(v) => setLocalSettings({
              ...localSettings,
              notifications: { ...localSettings.notifications, telegram: v }
            })}
          />
          <ToggleRow
            label="Slack Integration"
            description="Send alerts to Slack channel"
            checked={localSettings.notifications.slack}
            onChange={(v) => setLocalSettings({
              ...localSettings,
              notifications: { ...localSettings.notifications, slack: v }
            })}
          />

          <div className="pt-2">
            <label className="block text-sm text-slate-400 mb-2">Alert Threshold</label>
            <select
              value={localSettings.notifications.alertThreshold}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                notifications: { ...localSettings.notifications, alertThreshold: e.target.value }
              })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="critical">Critical Only</option>
              <option value="warning">Warnings & Critical</option>
              <option value="info">All Notifications</option>
            </select>
          </div>
        </div>
      </section>

      {/* System */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">System</h2>
        </div>

        <div className="space-y-4">
          <ToggleRow
            label="Maintenance Mode"
            description="Disable client dashboard access"
            checked={localSettings.system.maintenanceMode}
            onChange={(v) => setLocalSettings({
              ...localSettings,
              system: { ...localSettings.system, maintenanceMode: v }
            })}
          />
          <ToggleRow
            label="Debug Logging"
            description="Store detailed logs in MongoDB"
            checked={localSettings.system.debugLogs}
            onChange={(v) => setLocalSettings({
              ...localSettings,
              system: { ...localSettings.system, debugLogs: v }
            })}
          />

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-sm text-slate-400 mb-2">Backup Frequency</label>
              <select
                value={localSettings.system.backupFrequency}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  system: { ...localSettings.system, backupFrequency: e.target.value }
                })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              >
                <option value="hourly">Hourly</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-slate-400 mb-2">Log Retention (days)</label>
              <input
                type="number"
                value={localSettings.system.logRetention}
                onChange={(e) => setLocalSettings({
                  ...localSettings,
                  system: { ...localSettings.system, logRetention: parseInt(e.target.value) || 30 }
                })}
                className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Security */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <ToggleRow
            label="Two-Factor Authentication"
            description="Require 2FA for admin access"
            checked={localSettings.security.twoFactorAuth}
            onChange={(v) => setLocalSettings({
              ...localSettings,
              security: { ...localSettings.security, twoFactorAuth: v }
            })}
          />

          <div className="pt-2">
            <label className="block text-sm text-slate-400 mb-2">Session Timeout (hours)</label>
            <input
              type="number"
              value={localSettings.security.sessionTimeout}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                security: { ...localSettings.security, sessionTimeout: parseInt(e.target.value) || 24 }
              })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>
        </div>
      </section>

      {/* API Keys */}
      <section className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-purple-500/10 rounded-lg">
            <Key className="w-5 h-5 text-purple-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">API Keys</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <p className="text-white text-sm font-medium">n8n Webhook Token</p>
              <p className="text-xs text-slate-500 font-mono">1093fee2-60e0-4432-****</p>
            </div>
            <button className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
              Regenerate
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <p className="text-white text-sm font-medium">Make.com API Token</p>
              <p className="text-xs text-slate-500 font-mono">03106422-df8a-4378-****</p>
            </div>
            <button className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded transition-colors">
              Regenerate
            </button>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end gap-4">
        {saved && (
          <span className="flex items-center gap-2 text-emerald-400 text-sm">
            <Check className="w-4 h-4" /> Saved successfully!
          </span>
        )}
        <button 
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
        >
          {saveMutation.isPending ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <Save className="w-5 h-5" />
          )}
          Save Settings
        </button>
      </div>
    </div>
  );
}

// Toggle Component
function ToggleRow({ 
  label, 
  description, 
  checked, 
  onChange 
}: { 
  label: string; 
  description: string; 
  checked: boolean; 
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between p-4 bg-slate-950 rounded-lg border border-slate-800">
      <div>
        <h3 className="text-white font-medium">{label}</h3>
        <p className="text-sm text-slate-500">{description}</p>
      </div>
      <label className="relative inline-flex items-center cursor-pointer">
        <input 
          type="checkbox" 
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer" 
        />
        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600" />
      </label>
    </div>
  );
}
