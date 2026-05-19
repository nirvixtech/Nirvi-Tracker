import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from './components/ui/sonner'
import Login from './pages/Login'
import DashboardLayout from './components/layout/DashboardLayout'
import Dashboard from './pages/Dashboard'
import Projects from './pages/Projects'
import Upcoming from './pages/Upcoming'
import Ongoing from './pages/Ongoing'
import Servers from './pages/Servers'
import Domains from './pages/Domains'
import Team from './pages/Team'
import NotFound from './pages/NotFound'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/upcoming" element={<Upcoming />} />
          <Route path="/ongoing" element={<Ongoing />} />
          <Route path="/servers" element={<Servers />} />
          <Route path="/domains" element={<Domains />} />
          <Route path="/team" element={<Team />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  )
}

export default App
