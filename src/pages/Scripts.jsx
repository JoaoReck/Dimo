import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Check, Clock, Copy, Film, Plus, Trash2 } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { useGame } from '../lib/game'
import { Chip, Empty, PageHeader, Spinner, listAnim } from '../components/ui'

const PURPLE = '#9b51e0'
const STATUS = ['ideia', 'roteiro pronto', 'gravado', 'publicado']
const LABEL = { ideia: 'Ideia', 'roteiro pronto': 'Roteiro pronto', gravado: 'Gravado', publicado: 'Publicado' }

const blank = { title: '', theme: '', notes: '', script: '', minutes: 8, status: 'ideia', link: '' }

function Editor({ initial, onSave, onCancel, onDelete }) {
  const [f, setF] = useState({ ...blank, ...initial })
  const [copied, setCopied] = useState(false)
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })

  const copy = async () => {
    await navigator.clipboard.writeText(f.script || '')
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.div layout {...listAnim} className="card flex flex-col gap-3 p-5">
      <input className="input !text-lg !font-bold" placeholder="Título do vídeo" value={f.title} onChange={set('title')} />
      <input className="input" placeholder="Tema do estudo" value={f.theme} onChange={set('theme')} />
      <textarea rows={4} className="input resize-y" placeholder="Informações e anotações do estudo" value={f.notes} onChange={set('notes')} />
      <div>
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-bold text-muted">Roteiro</span>
          <button type="button" onClick={copy} className="btn btn-ghost !px-3 !py-1.5 text-sm">
            {copied ? <Check size={15} /> : <Copy size={15} />} {copied ? 'Copiado' : 'Copiar'}
          </button>
        </div>
        <textarea rows={12} className="input resize-y font-mono text-sm" placeholder="Cole aqui o roteiro que você gerou" value={f.script} onChange={set('script')} />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        <label className="flex items-center gap-2 text-sm font-bold text-muted">
          <Clock size={16} /> Duração (min)
          <input type="number" min="1" className="input !w-24" value={f.minutes} onChange={set('minutes')} />
        </label>
        <input className="input" placeholder="Link de referência" value={f.link} onChange={set('link')} />
      </div>
      <div className="flex flex-wrap gap-2">
        {STATUS.map((s) => (
          <Chip key={s} active={f.status === s} color={PURPLE} onClick={() => setF({ ...f, status: s })}>
            {LABEL[s]}
          </Chip>
        ))}
      </div>
      <div className="flex items-center gap-2">
        {onDelete && (
          <button type="button" onClick={onDelete} className="btn btn-ghost !p-2" title="Apagar">
            <Trash2 size={18} />
          </button>
        )}
        <button type="button" onClick={onCancel} className="btn btn-ghost ml-auto">Cancelar</button>
        <button
          type="button"
          onClick={() => f.title.trim() && onSave({ ...f, title: f.title.trim(), minutes: Number(f.minutes) || 0 })}
          className="btn text-white"
          style={{ background: PURPLE }}
        >
          Salvar
        </button>
      </div>
    </motion.div>
  )
}

export default function Scripts() {
  const { items, loading, add, update, remove } = useCollection('scripts')
  const { addXp } = useGame()
  const [editing, setEditing] = useState(null) // 'new' | id | null

  const save = async (data) => {
    const { id, created, ...rest } = data
    if (editing === 'new') {
      await add(rest)
      addXp(10, 'novo roteiro')
    } else {
      const old = items.find((i) => i.id === editing)
      await update(editing, rest)
      if (rest.status === 'publicado' && old?.status !== 'publicado') addXp(30, 'vídeo publicado')
    }
    setEditing(null)
  }

  return (
    <div>
      <PageHeader
        title="Roteiro"
        subtitle="Guarde o estudo e o roteiro de cada vídeo"
        color={PURPLE}
        icon={Film}
        action={
          <button className="btn text-white" style={{ background: PURPLE }} onClick={() => setEditing('new')}>
            <Plus size={18} /> Novo
          </button>
        }
      />

      <div className="flex flex-col gap-3">
        <AnimatePresence initial={false}>
          {editing === 'new' && <Editor key="new" onSave={save} onCancel={() => setEditing(null)} />}
        </AnimatePresence>

        {loading ? (
          <Spinner />
        ) : items.length === 0 && editing !== 'new' ? (
          <Empty emoji="🎬" title="Nenhum roteiro salvo" text="Registre o tema do estudo e cole o roteiro que você gerou. Vídeo publicado vale 30 XP." />
        ) : (
          items.map((s) =>
            editing === s.id ? (
              <Editor
                key={s.id}
                initial={s}
                onSave={save}
                onCancel={() => setEditing(null)}
                onDelete={async () => { await remove(s.id); setEditing(null) }}
              />
            ) : (
              <motion.button
                key={s.id}
                layout
                {...listAnim}
                onClick={() => setEditing(s.id)}
                className="card p-4 text-left transition hover:-translate-y-0.5"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <div className="truncate font-bold">{s.title}</div>
                    {s.theme && <div className="truncate text-sm text-muted">{s.theme}</div>}
                  </div>
                  <span className="shrink-0 rounded-full px-3 py-1 text-xs font-bold" style={{ background: '#f1e6fb', color: PURPLE }}>
                    {LABEL[s.status] || s.status}
                  </span>
                </div>
                <div className="mt-2 flex items-center gap-3 text-xs font-semibold text-muted">
                  <span className="flex items-center gap-1"><Clock size={13} /> {s.minutes || 0} min</span>
                  <span>{s.script ? 'Com roteiro' : 'Sem roteiro'}</span>
                </div>
              </motion.button>
            ),
          )
        )}
      </div>
    </div>
  )
}
