import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { BookOpen, Check, Film, Inbox, Languages, Trash2 } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { useGame } from '../lib/game'
import { Empty, PageHeader, Spinner, listAnim } from '../components/ui'

export default function InboxPage() {
  const inbox = useCollection('inbox')
  const studies = useCollection('studies')
  const words = useCollection('words')
  const scripts = useCollection('scripts')
  const { addXp } = useGame()
  const [text, setText] = useState('')

  const add = async (e) => {
    e.preventDefault()
    const v = text.trim()
    if (!v) return
    setText('')
    await inbox.add({ text: v })
  }

  const move = async (item, target) => {
    if (target === 'studies') await studies.add({ title: item.text, notes: '', link: '', status: 'todo' })
    if (target === 'words') await words.add({ term: item.text, meaning: '', example: '', box: 0, next: '' })
    if (target === 'scripts') await scripts.add({ title: item.text, theme: item.text, notes: '', script: '', minutes: 8, status: 'ideia' })
    await inbox.remove(item.id)
    addXp(5, 'organizou')
  }

  const done = async (item) => {
    await inbox.remove(item.id)
    addXp(3, 'resolvido')
  }

  return (
    <div>
      <PageHeader
        title="Inbox"
        subtitle="Jogue tudo aqui. Organize depois, com calma."
        color="#ff8a3d"
        icon={Inbox}
      />

      <form onSubmit={add} className="card mb-5 flex gap-2 p-3">
        <input
          className="input"
          placeholder="O que você quer lembrar?"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className="btn btn-accent">Salvar</button>
      </form>

      {inbox.loading ? (
        <Spinner />
      ) : inbox.items.length === 0 ? (
        <Empty emoji="🎉" title="Inbox zerada" text="Tudo organizado. Quando surgir algo, anote rápido pelo botão laranja." />
      ) : (
        <div className="flex flex-col gap-3">
          <AnimatePresence initial={false}>
            {inbox.items.map((item) => (
              <motion.div key={item.id} layout {...listAnim} className="card p-4">
                <p className="whitespace-pre-wrap break-words font-medium">{item.text}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-muted">Mover para:</span>
                  <button onClick={() => move(item, 'studies')} className="btn !px-3 !py-1.5 text-sm" style={{ background: '#eaf2ff', color: '#1a73e8' }}>
                    <BookOpen size={15} /> Estudos
                  </button>
                  <button onClick={() => move(item, 'words')} className="btn !px-3 !py-1.5 text-sm" style={{ background: '#e3f7ed', color: '#0c9455' }}>
                    <Languages size={15} /> Inglês
                  </button>
                  <button onClick={() => move(item, 'scripts')} className="btn !px-3 !py-1.5 text-sm" style={{ background: '#f1e6fb', color: '#9b51e0' }}>
                    <Film size={15} /> Roteiro
                  </button>
                  <span className="ml-auto flex gap-1">
                    <button onClick={() => done(item)} className="btn btn-ghost !p-2" title="Resolvido">
                      <Check size={18} />
                    </button>
                    <button onClick={() => inbox.remove(item.id)} className="btn btn-ghost !p-2" title="Apagar">
                      <Trash2 size={18} />
                    </button>
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  )
}
