import { motion } from 'framer-motion'

export function PageHeader({ title, subtitle, color, icon: Icon, action }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div className="flex items-center gap-3">
        {Icon && (
          <div
            className="grid h-12 w-12 place-items-center rounded-2xl text-white"
            style={{ background: color }}
          >
            <Icon size={24} />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-muted">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function Empty({ emoji, title, text }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card flex flex-col items-center px-6 py-12 text-center"
    >
      <div className="mb-3 text-5xl">{emoji}</div>
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-muted">{text}</p>
    </motion.div>
  )
}

export function Chip({ active, color, onClick, children }) {
  return (
    <button
      onClick={onClick}
      className="rounded-full px-3.5 py-1.5 text-sm font-bold transition"
      style={
        active
          ? { background: color, color: '#fff' }
          : { background: '#fff', color: '#5b6b82', border: '1.5px solid #e3eaf5' }
      }
    >
      {children}
    </button>
  )
}

export function Spinner() {
  return (
    <div className="grid place-items-center py-16">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
    </div>
  )
}

export const listAnim = {
  initial: { opacity: 0, y: 12, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, x: -30 },
  transition: { type: 'spring', stiffness: 300, damping: 26 },
}
