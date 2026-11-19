import { useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  BookOpen, Film, Flame, Home, Inbox, Languages, LogOut, Plus, Sparkles, X,
} from 'lucide-react'
import { useAuth } from '../lib/auth'
import { levelOf, progressOf, useGame } from '../lib/game'
import { useCollection } from '../lib/hooks'

export const NAV = [
  { to: '/', label: 'Hoje', icon: Home, color: '#1a73e8' },
  { to: '/inbox', label: 'Inbox', icon: Inbox, color: '#ff8a3d' },
  { to: '/estudos', label: 'Estudos', icon: BookOpen, color: '#1a73e8' },
  { to: '/ingles', label: 'Inglês', icon: Languages, color: '#12b76a' },
  { to: '/roteiro', label: 'Roteiro', icon: Film, color: '#9b51e0' },
]

function Logo() {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/icon.svg" alt="" className="h-9 w-9" />
      <span className="text-xl font-extrabold tracking-tight">Dimo</span>
    </div>
  )
}

function Stats() {
  const { profile } = useGame()
  const level = levelOf(profile.xp)
  return (
    <div className="rounded-2xl bg-brand-50 p-3">
      <div className="mb-1.5 flex items-center justify-between text-xs font-bold">
        <span className="flex items-center gap-1 text-brand-700">
          <Sparkles size={14} /> Nível {level}
        </span>
        <span className="flex items-center gap-1 text-accent-600">
          <Flame size={14} /> {profile.streak} {profile.streak === 1 ? 'dia' : 'dias'}
        </span>
      </div>
      <div className="h-2.5 overflow-hidden rounded-full bg-white">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500"
          animate={{ width: `${progressOf(profile.xp) * 100}%` }}
          transition={{ type: 'spring', stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-1 text-right text-[11px] font-semibold text-muted">{profile.xp} XP</div>
    </div>
  )
}

function QuickCapture({ open, onClose }) {
  const { add } = useCollection('inbox')
  const [text, setText] = useState('')

  const save = async (e) => {
    e.preventDefault()
    const value = text.trim()
    if (!value) return
    await add({ text: value })
    setText('')
    onClose()
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 p-0 backdrop-blur-sm md:items-center md:p-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.form
            onSubmit={save}
            onClick={(e) => e.stopPropagation()}
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            className="card w-full max-w-lg rounded-b-none p-5 md:rounded-b-3xl"
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-lg font-extrabold">Anotar rápido</h2>
              <button type="button" className="btn btn-ghost !p-2" onClick={onClose}>
                <X size={20} />
              </button>
            </div>
            <textarea
              autoFocus
              rows={4}
              className="input resize-none"
              placeholder="Uma ideia, algo pra estudar, uma palavra nova, um link..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) save(e)
              }}
            />
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-muted">Depois você organiza na Inbox. Ctrl+Enter salva.</span>
              <button className="btn btn-accent">Salvar</button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function Layout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const [capture, setCapture] = useState(false)

  return (
    <div className="mx-auto flex min-h-full max-w-6xl">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 flex-col gap-6 p-5 md:flex">
        <Logo />
        <nav className="flex flex-col gap-1">
          {NAV.map(({ to, label, icon: Icon, color }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 text-[15px] font-bold transition ${
                  isActive ? 'bg-white shadow-sm' : 'text-muted hover:bg-white/60'
                }`
              }
              style={({ isActive }) => (isActive ? { color } : undefined)}
            >
              <Icon size={20} /> {label}
            </NavLink>
          ))}
        </nav>
        <button className="btn btn-accent" onClick={() => setCapture(true)}>
          <Plus size={18} /> Anotar rápido
        </button>
        <div className="mt-auto flex flex-col gap-3">
          <Stats />
          <div className="flex items-center gap-2 text-xs text-muted">
            <span className="truncate">{user?.email}</span>
            <button className="btn btn-ghost !p-2" onClick={logout} title="Sair">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      <main className="min-w-0 flex-1 px-4 pb-28 pt-5 md:px-8 md:pb-10 md:pt-8">
        <div className="mb-4 md:hidden">
          <div className="flex items-center justify-between">
            <Logo />
            <button className="btn btn-ghost !p-2" onClick={logout} title="Sair">
              <LogOut size={18} />
            </button>
          </div>
          <div className="mt-3">
            <Stats />
          </div>
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Botão flutuante mobile */}
      <button
        onClick={() => setCapture(true)}
        className="fixed bottom-24 right-4 z-30 grid h-14 w-14 place-items-center rounded-full bg-accent-500 text-white shadow-xl shadow-accent-500/40 transition active:scale-90 md:hidden"
        aria-label="Anotar rápido"
      >
        <Plus size={26} />
      </button>

      {/* Navegação inferior mobile */}
      <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 flex justify-around border-t border-line bg-white/90 px-2 pt-2 backdrop-blur md:hidden">
        {NAV.map(({ to, label, icon: Icon, color }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className="flex min-w-14 flex-col items-center gap-0.5 rounded-xl px-2 py-1 text-[11px] font-bold"
            style={({ isActive }) => ({ color: isActive ? color : '#5b6b82' })}
          >
            <Icon size={22} /> {label}
          </NavLink>
        ))}
      </nav>

      <QuickCapture open={capture} onClose={() => setCapture(false)} />
    </div>
  )
}
