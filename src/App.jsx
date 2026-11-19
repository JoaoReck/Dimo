import { Navigate, Route, Routes } from 'react-router-dom'
import { useAuth } from './lib/auth'
import { GameProvider } from './lib/game'
import Layout from './components/Layout'
import { Spinner } from './components/ui'
import Login from './pages/Login'
import Today from './pages/Today'
import InboxPage from './pages/Inbox'
import Studies from './pages/Studies'
import English from './pages/English'
import Scripts from './pages/Scripts'

export default function App() {
  const { user, loading } = useAuth()

  if (loading) return <Spinner />
  if (!user) return <Login />

  return (
    <GameProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Today />} />
          <Route path="inbox" element={<InboxPage />} />
          <Route path="estudos" element={<Studies />} />
          <Route path="ingles" element={<English />} />
          <Route path="roteiro" element={<Scripts />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </GameProvider>
  )
}
