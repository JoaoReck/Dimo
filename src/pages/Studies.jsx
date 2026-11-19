import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, ChevronDown, ExternalLink, Trash2 } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { useGame } from '../lib/game'
import { Chip, Empty, PageHeader, Spinner, listAnim } from '../components/ui'

const STATUS = {
  todo: { label: 'Para ver', color: '#ff8a3d' },
  doing: { label: 'Estudando', color: '#1a73e8' },
  done: { label: 'Concluído', color: '#12b76a' },
}

function StudyCard({ item, onUpdate, onRemove, onComplete }) {
  const [open, setOpen] = useState(false)
  const [notes, setNotes] = useState(item.notes || '')
  const s = STATUS[item.status] || STATUS.todo
  const isDone = item.status === 'done'

  const setStatus = (status) => {
    if (status === 'done' && !isDone) onComplete()
    onUpdate(item.id, { status })
  }

  return (
    <motion.div layout {...listAnim} className="card overflow-hidden">
      <div className="flex items-center gap-3 p-4">
        <button
          onClick={() => setStatus(isDone ? 'todo' : 'done')}
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full border-2 transition"
          style={{ borderColor: s.color, background: isDone ? s.color : 'transparent', color: '#fff' }}
          title={isDone ? 'Reabrir' : 'Concluir'}
        >
          {isDone && <Check size={18} strokeWidth={3} />}
        </button>
        <button className="min-w-0 flex-1 text-left" onClick={() => setOpen(!open)}>
          <div className={`font-bold ${isDone ? 'text-muted line-through' : ''}`}>{item.title}</div>
          <span className="mt-0.5 inline-block text-xs font-bold" style={{ color: s.color }}>{s.label}</span>
        </button>
        {item.link && (
          <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-ghost !p-2" title="Abrir link">
            <ExternalLink size={18} />
          </a>
        )}
        <button onClick={() => setOpen(!open)} className="btn btn-ghost !p-2">
          <motion.span animate={{ rotate: open ? 180 : 0 }}><ChevronDown size={18} /></motion.span>
        </button>
      </div>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex flex-col gap-3 border-t border-line p-4">
              <textarea
                rows={5}
                className="input resize-y"
                placeholder="O que você aprendeu ou quer lembrar sobre isso..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                onBlur={() => notes !== (item.notes || '') && onUpdate(item.id, { notes })}
              />
              <input
                className="input"
                placeholder="Link (vídeo, artigo, curso)"
                defaultValue={item.link || ''}
                onBlur={(e) => e.target.value !== (item.link || '') && onUpdate(item.id, { link: e.target.value.trim() })}
              />
              <div className="flex flex-wrap items-center gap-2">
                {Object.entries(STATUS).map(([k, v]) => (
                  <Chip key={k} active={item.status === k} color={v.color} onClick={() => setStatus(k)}>
                    {v.label}
                  </Chip>
                ))}
                <button onClick={() => onRemove(item.id)} className="btn btn-ghost ml-auto !p-2" title="Apagar">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

export default function Studies() {
  const { items, loading, add, update, remove } = useCollection('studies')
  const { addXp } = useGame()
  const [title, setTitle] = useState('')
  const [filter, setFilter] = useState('open')

  const submit = async (e) => {
    e.preventDefault()
    const v = title.trim()
    if (!v) return
    setTitle('')
    await add({ title: v, notes: '', link: '', status: 'todo' })
  }

  const shown = items.filter((i) =>
    filter === 'all' ? true : filter === 'open' ? i.status !== 'done' : i.status === filter,
  )
  const doneCount = items.filter((i) => i.status === 'done').length

  return (
    <div>
      <PageHeader
        title="Estudos"
        subtitle={`${doneCount} de ${items.length} concluídos`}
        color="#1a73e8"
        icon={BookOpen}
      />

      <form onSubmit={submit} className="card mb-4 flex gap-2 p-3">
        <input
          className="input"
          placeholder="O que você quer estudar? (ex.: LCM de IA)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button className="btn btn-primary">Adicionar</button>
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={filter === 'open'} color="#1a73e8" onClick={() => setFilter('open')}>Em aberto</Chip>
        <Chip active={filter === 'done'} color="#12b76a" onClick={() => setFilter('done')}>Concluídos</Chip>
        <Chip active={filter === 'all'} color="#5b6b82" onClick={() => setFilter('all')}>Todos</Chip>
      </div>

      {loading ? (
        <Spinner />
      ) : shown.length === 0 ? (
        <Empty emoji="📚" title="Nada por aqui" text="Anote o que despertar sua curiosidade. Cada estudo concluído vale 20 XP." />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {shown.map((i) => (
              <StudyCard
                key={i.id}
                item={i}
                onUpdate={update}
                onRemove={remove}
                onComplete={() => addXp(20, 'estudo concluído')}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
