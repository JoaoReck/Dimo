import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, Film, Flame, Inbox, Languages, Plus, Trash2 } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { useCollection } from '../lib/hooks'
import { levelOf, useGame } from '../lib/game'
import { dateKey, greeting } from '../lib/dates'
import { listAnim } from '../components/ui'

function Tile({ to, icon: Icon, color, bg, value, label }) {
  return (
    <Link to={to}>
      <motion.div
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.97 }}
        className="card flex h-full flex-col gap-2 p-4"
      >
        <div className="grid h-10 w-10 place-items-center rounded-xl" style={{ background: bg, color }}>
          <Icon size={20} />
        </div>
        <div className="text-3xl font-extrabold leading-none" style={{ color }}>{value}</div>
        <div className="text-sm font-semibold text-muted">{label}</div>
      </motion.div>
    </Link>
  )
}

function Habits() {
  const { items, add, update, remove } = useCollection('habits')
  const { addXp } = useGame()
  const [name, setName] = useState('')
  const today = dateKey()

  const submit = async (e) => {
    e.preventDefault()
    const v = name.trim()
    if (!v) return
    setName('')
    await add({ name: v, lastDone: '', xpDate: '' })
  }

  const toggle = async (h) => {
    const done = h.lastDone === today
    if (done) return update(h.id, { lastDone: '' })
    const first = h.xpDate !== today // só ganha XP uma vez por dia
    await update(h.id, { lastDone: today, xpDate: today })
    if (first) addXp(5, h.name)
  }

  const doneCount = items.filter((h) => h.lastDone === today).length

  return (
    <section className="card p-5">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-lg font-extrabold">Hábitos de hoje</h2>
        {items.length > 0 && (
          <span className="rounded-full bg-habit/10 px-3 py-1 text-xs font-bold text-habit">
            {doneCount}/{items.length}
          </span>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <AnimatePresence initial={false}>
          {items.map((h) => {
            const done = h.lastDone === today
            return (
              <motion.div key={h.id} layout {...listAnim} className="group flex items-center gap-3 rounded-2xl bg-canvas px-3 py-2.5">
                <button
                  onClick={() => toggle(h)}
                  className="grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition"
                  style={{ borderColor: '#e8318a', background: done ? '#e8318a' : 'transparent', color: '#fff' }}
                >
                  {done && <Check size={16} strokeWidth={3} />}
                </button>
                <span className={`flex-1 font-semibold ${done ? 'text-muted line-through' : ''}`}>{h.name}</span>
                <button onClick={() => remove(h.id)} className="btn btn-ghost !p-1.5 opacity-0 transition group-hover:opacity-100 max-md:opacity-60">
                  <Trash2 size={15} />
                </button>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>

      <form onSubmit={submit} className="mt-3 flex gap-2">
        <input
          className="input"
          placeholder="Novo hábito (beber água, ler, exercício...)"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button className="btn btn-primary !px-4" aria-label="Adicionar hábito"><Plus size={18} /></button>
      </form>
    </section>
  )
}

export default function Today() {
  const { user } = useAuth()
  const { profile } = useGame()
  const inbox = useCollection('inbox')
  const studies = useCollection('studies')
  const words = useCollection('words')
  const scripts = useCollection('scripts')

  const today = dateKey()
  const firstName = (user?.displayName || '').split(' ')[0]
  const openStudies = studies.items.filter((s) => s.status !== 'done').length
  const dueWords = words.items.filter((w) => w.meaning && (!w.next || w.next <= today)).length
  const activeScripts = scripts.items.filter((s) => s.status !== 'publicado').length

  return (
    <div className="flex flex-col gap-5">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-brand-500 to-brand-700 p-6 text-white md:p-8"
      >
        <motion.div
          className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-accent-500/80 blur-sm"
          animate={{ scale: [1, 1.12, 1] }}
          transition={{ duration: 6, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-12 right-24 h-32 w-32 rounded-full bg-white/15"
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity }}
        />
        <div className="relative">
          <p className="text-sm font-semibold opacity-90">{greeting()}{firstName ? `, ${firstName}` : ''}</p>
          <h1 className="mt-1 text-3xl font-extrabold tracking-tight md:text-4xl">Vamos evoluir hoje?</h1>
          <div className="mt-4 flex flex-wrap gap-2 text-sm font-bold">
            <span className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5">
              <Flame size={16} /> {profile.streak} {profile.streak === 1 ? 'dia' : 'dias'} seguidos
            </span>
            <span className="rounded-full bg-white/20 px-3 py-1.5">Nível {levelOf(profile.xp)}</span>
          </div>
        </div>
      </motion.section>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Tile to="/inbox" icon={Inbox} color="#ff8a3d" bg="#ffe8d6" value={inbox.items.length} label="Na inbox" />
        <Tile to="/estudos" icon={BookOpen} color="#1a73e8" bg="#eaf2ff" value={openStudies} label="Para estudar" />
        <Tile to="/ingles" icon={Languages} color="#12b76a" bg="#e3f7ed" value={dueWords} label="Palavras p/ revisar" />
        <Tile to="/roteiro" icon={Film} color="#9b51e0" bg="#f1e6fb" value={activeScripts} label="Roteiros ativos" />
      </div>

      <Habits />
    </div>
  )
}
