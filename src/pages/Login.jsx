import { motion } from 'framer-motion'
import { BookOpen, Film, Languages, Sparkles } from 'lucide-react'
import { useAuth } from '../lib/auth'
import { firebaseReady } from '../lib/firebase'

const floaters = [
  { icon: BookOpen, color: '#1a73e8', x: '8%', y: '18%', d: 0 },
  { icon: Languages, color: '#12b76a', x: '82%', y: '22%', d: 0.6 },
  { icon: Film, color: '#9b51e0', x: '14%', y: '74%', d: 1.1 },
  { icon: Sparkles, color: '#ff8a3d', x: '78%', y: '72%', d: 1.7 },
]

export default function Login() {
  const { login, error } = useAuth()
  return (
    <div className="relative grid min-h-full place-items-center overflow-hidden p-6">
      {floaters.map(({ icon: Icon, color, x, y, d }, i) => (
        <motion.div
          key={i}
          className="absolute hidden h-16 w-16 place-items-center rounded-3xl text-white shadow-xl sm:grid"
          style={{ left: x, top: y, background: color }}
          animate={{ y: [0, -14, 0], rotate: [-4, 4, -4] }}
          transition={{ duration: 5, repeat: Infinity, delay: d, ease: 'easeInOut' }}
        >
          <Icon size={30} />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, y: 24, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        className="card relative w-full max-w-sm p-8 text-center"
      >
        <img src="/icon.svg" alt="Dimo" className="mx-auto mb-4 h-20 w-20" />
        <h1 className="text-3xl font-extrabold tracking-tight">Dimo</h1>
        <p className="mt-2 text-muted">
          Anote, estude e evolua todo dia. Tudo no mesmo lugar.
        </p>

        {!firebaseReady && (
          <p className="mt-5 rounded-2xl bg-accent-100 p-3 text-left text-sm font-semibold text-accent-600">
            Firebase não configurado. Copie <code>.env.example</code> para <code>.env</code> e preencha os dados do seu projeto.
          </p>
        )}
        {error && <p className="mt-4 text-sm font-semibold text-red-600">{error}</p>}

        <button onClick={login} disabled={!firebaseReady} className="btn btn-primary mt-6 w-full disabled:opacity-50">
          <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#fff" d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z"/></svg>
          Entrar com Google
        </button>
      </motion.div>
    </div>
  )
}
