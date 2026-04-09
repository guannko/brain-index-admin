import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './contexts/ThemeContext'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Bots from './pages/Bots'
import Clients from './pages/Clients'
import Automations from './pages/Automations'
import Infrastructure from './pages/Infrastructure'
import Alerts from './pages/Alerts'
import Settings from './pages/Settings'
import CRM from './pages/CRM'
import Analytics from './pages/Analytics'

const queryClient = new QueryClient()

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="projects" element={<Projects />} />
              <Route path="bots" element={<Bots />} />
              <Route path="clients" element={<Clients />} />
              <Route path="automations" element={<Automations />} />
              <Route path="infrastructure" element={<Infrastructure />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="settings" element={<Settings />} />
              <Route path="crm" element={<CRM />} />
              <Route path="analytics" element={<Analytics />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
