import { useState } from 'react';
import { Save, Shield, Bell, Database, Workflow, Key } from 'lucide-react';

export default function Settings() {
  const [settings, setSettings] = useState({
    // Notifications
    emailAlerts: true,
    slackAlerts: false,
    alertThreshold: 'warning',
    
    // System
    autoBackup: true,
    backupFrequency: 'daily',
    logRetention: '30',
    
    // Security
    twoFactorAuth: false,
    sessionTimeout: '24',
  });

  const handleSave = () => {
    // TODO: Save to backend
    alert('Settings saved!');
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Settings</h1>
        <p className="text-slate-400">Configure system preferences</p>
      </div>

      {/* Notifications */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-amber-500/10 rounded-lg">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Notifications</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Email Alerts</p>
              <p className="text-sm text-slate-400">Receive critical alerts via email</p>
            </div>
            <input
              type="checkbox"
              checked={settings.emailAlerts}
              onChange={(e) => setSettings({ ...settings, emailAlerts: e.target.checked })}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-indigo-600"
            />
          </label>

          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Slack Integration</p>
              <p className="text-sm text-slate-400">Send alerts to Slack channel</p>
            </div>
            <input
              type="checkbox"
              checked={settings.slackAlerts}
              onChange={(e) => setSettings({ ...settings, slackAlerts: e.target.checked })}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-indigo-600"
            />
          </label>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Alert Threshold</label>
            <select
              value={settings.alertThreshold}
              onChange={(e) => setSettings({ ...settings, alertThreshold: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            >
              <option value="error">Errors Only</option>
              <option value="warning">Warnings & Errors</option>
              <option value="info">All Notifications</option>
            </select>
          </div>
        </div>
      </div>

      {/* System */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-500/10 rounded-lg">
            <Database className="w-5 h-5 text-indigo-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">System</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Auto Backup</p>
              <p className="text-sm text-slate-400">Automatically backup database</p>
            </div>
            <input
              type="checkbox"
              checked={settings.autoBackup}
              onChange={(e) => setSettings({ ...settings, autoBackup: e.target.checked })}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-indigo-600"
            />
          </label>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Backup Frequency</label>
            <select
              value={settings.backupFrequency}
              onChange={(e) => setSettings({ ...settings, backupFrequency: e.target.value })}
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
              value={settings.logRetention}
              onChange={(e) => setSettings({ ...settings, logRetention: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* Security */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-emerald-500/10 rounded-lg">
            <Shield className="w-5 h-5 text-emerald-400" />
          </div>
          <h2 className="text-lg font-semibold text-white">Security</h2>
        </div>

        <div className="space-y-4">
          <label className="flex items-center justify-between cursor-pointer">
            <div>
              <p className="text-white font-medium">Two-Factor Authentication</p>
              <p className="text-sm text-slate-400">Require 2FA for admin access</p>
            </div>
            <input
              type="checkbox"
              checked={settings.twoFactorAuth}
              onChange={(e) => setSettings({ ...settings, twoFactorAuth: e.target.checked })}
              className="w-5 h-5 rounded bg-slate-800 border-slate-700 text-indigo-600"
            />
          </label>

          <div>
            <label className="block text-sm text-slate-400 mb-2">Session Timeout (hours)</label>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => setSettings({ ...settings, sessionTimeout: e.target.value })}
              className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
            />
          </div>
        </div>
      </div>

      {/* API Keys */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
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
            <button className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded">
              Regenerate
            </button>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-950 rounded-lg border border-slate-800">
            <div>
              <p className="text-white text-sm font-medium">Make.com API Token</p>
              <p className="text-xs text-slate-500 font-mono">03106422-df8a-4378-****</p>
            </div>
            <button className="px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-white rounded">
              Regenerate
            </button>
          </div>
        </div>
      </div>

      {/* Save */}
      <button 
        onClick={handleSave}
        className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
      >
        <Save className="w-5 h-5" />
        Save Settings
      </button>
    </div>
  );
}
