import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import {
  LayoutDashboard, FolderKanban, Bot, Users, Workflow, Server,
  Bell, Settings, UserCheck, BarChart3, Sun, Moon,
} from 'lucide-react'
import { useTheme } from '../contexts/ThemeContext'

export default function Sidebar() {
  const location = useLocation()
  const { t, i18n } = useTranslation()
  const { theme, toggleTheme } = useTheme()

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: t('nav.dashboard') },
    { path: '/projects', icon: FolderKanban, label: t('nav.projects') },
    { path: '/bots', icon: Bot, label: t('nav.bots') },
    { path: '/clients', icon: Users, label: t('nav.clients') },
    { path: '/automations', icon: Workflow, label: t('nav.automations') },
    { path: '/infrastructure', icon: Server, label: t('nav.infrastructure') },
    { path: '/alerts', icon: Bell, label: t('nav.alerts') },
    { path: '/crm', icon: UserCheck, label: t('nav.crm') },
    { path: '/analytics', icon: BarChart3, label: t('nav.analytics') },
    { path: '/settings', icon: Settings, label: t('nav.settings') },
  ]

  function toggleLang() {
    const next = i18n.language === 'ru' ? 'en' : 'ru'
    i18n.changeLanguage(next)
    localStorage.setItem('lang', next)
  }

  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col min-h-screen">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-xl font-bold text-white">Brain Index</h1>
        <p className="text-xs text-gray-400 mt-1">Admin Panel</p>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive =
            path === '/' ? location.pathname === '/' : location.pathname.startsWith(path)
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          {theme === 'dark' ? t('theme.light') : t('theme.dark')}
        </button>
        <button
          onClick={toggleLang}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        >
          <span className="text-base leading-none">🌐</span>
          {i18n.language === 'ru' ? 'English' : 'Русский'}
        </button>
      </div>
    </div>
  )
}
