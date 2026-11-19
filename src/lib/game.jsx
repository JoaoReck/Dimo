import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import { doc, increment, onSnapshot, setDoc } from 'firebase/firestore'
import { AnimatePresence, motion } from 'framer-motion'
import { db } from './firebase'
import { useAuth } from './auth'
import { dateKey, yesterdayKey } from './dates'

const GameContext = createContext(null)

export const XP_PER_LEVEL = 100
export const levelOf = (xp) => Math.floor(xp / XP_PER_LEVEL) + 1
export const progressOf = (xp) => (xp % XP_PER_LEVEL) / XP_PER_LEVEL

export function GameProvider({ children }) {
  const { user } = useAuth()
  const [profile, setProfile] = useState({ xp: 0, streak: 0, lastActive: '' })
  const [toasts, setToasts] = useState([])

  const ref = user ? doc(db, 'users', user.uid, 'meta', 'profile') : null

  useEffect(() => {
    if (!user) return
    const r = doc(db, 'users', user.uid, 'meta', 'profile')
    return onSnapshot(r, (snap) => {
      const data = snap.exists() ? snap.data() : { xp: 0, streak: 0, lastActive: '' }
      setProfile({ xp: 0, streak: 0, lastActive: '', ...data })
      const today = dateKey()
      if (data.lastActive !== today) {
        // novo dia: mantém a sequência se abriu ontem, senão recomeça
        const streak = data.lastActive === yesterdayKey() ? (data.streak || 0) + 1 : 1
        setDoc(r, { streak, lastActive: today }, { merge: true })
      }
    })
  }, [user])

  const addXp = useCallback(
    (amount, label = '') => {
      if (!ref) return
      setDoc(ref, { xp: increment(amount) }, { merge: true })
      const id = Math.random().toString(36).slice(2)
      setToasts((t) => [...t, { id, amount, label }])
      setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2200)
    },
    [ref],
  )

  return (
    <GameContext.Provider value={{ profile, addXp }}>
      {children}
      <div className="pointer-events-none fixed inset-x-0 top-4 z-50 flex flex-col items-center gap-2">
        <AnimatePresence>
          {toasts.map((t) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: -20, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20 }}
              className="rounded-full bg-accent-500 px-4 py-2 text-sm font-extrabold text-white shadow-lg"
            >
              +{t.amount} XP {t.label && <span className="font-semibold opacity-90">· {t.label}</span>}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </GameContext.Provider>
  )
}

export const useGame = () => useContext(GameContext)
