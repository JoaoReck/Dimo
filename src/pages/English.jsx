import { useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Languages, Search, Trash2, Volume2 } from 'lucide-react'
import { useCollection } from '../lib/hooks'
import { useGame } from '../lib/game'
import { addDaysKey, dateKey } from '../lib/dates'
import { Chip, Empty, PageHeader, Spinner, listAnim } from '../components/ui'

// Repetição espaçada: caixa 0..5 => dias até a próxima revisão
const INTERVALS = [1, 3, 7, 14, 30, 60]
const GREEN = '#12b76a'

function speak(text) {
  try {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  } catch {
    /* navegador sem voz */
  }
}

function Review({ due: liveDue, onAnswer }) {
  // snapshot da fila no início da sessão (a lista viva encolhe conforme respondo)
  const [due] = useState(liveDue)
  const [index, setIndex] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const word = due[index]

  if (!word) {
    return (
      <Empty emoji="🏆" title="Revisão do dia concluída" text="Volte amanhã para revisar mais palavras no ponto certo para lembrar." />
    )
  }

  const answer = async (ok) => {
    setFlipped(false)
    await onAnswer(word, ok)
    setIndex((i) => i + 1)
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="mb-3 text-center text-sm font-bold text-muted">
        {index + 1} de {due.length}
      </div>
      <div style={{ perspective: 1000 }}>
        <motion.div
          key={word.id}
          onClick={() => setFlipped(!flipped)}
          className="relative h-64 cursor-pointer"
          style={{ transformStyle: 'preserve-3d' }}
          animate={{ rotateY: flipped ? 180 : 0 }}
          transition={{ type: 'spring', stiffness: 160, damping: 20 }}
        >
          <div
            className="card absolute inset-0 flex flex-col items-center justify-center gap-3 p-6 text-center"
            style={{ backfaceVisibility: 'hidden' }}
          >
            <div className="text-3xl font-extrabold" style={{ color: GREEN }}>{word.term}</div>
            <button
              onClick={(e) => { e.stopPropagation(); speak(word.term) }}
              className="btn btn-ghost !p-2"
              title="Ouvir"
            >
              <Volume2 size={20} />
            </button>
            <div className="text-xs text-muted">Toque para ver o significado</div>
          </div>
          <div
            className="card absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center"
            style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)', background: '#e3f7ed' }}
          >
            <div className="text-2xl font-extrabold">{word.meaning || '(sem significado anotado)'}</div>
            {word.example && <div className="text-sm italic text-muted">"{word.example}"</div>}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {flipped && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-5 grid grid-cols-2 gap-3"
          >
            <button onClick={() => answer(false)} className="btn" style={{ background: '#fde7e7', color: '#d92d20' }}>
              Errei
            </button>
            <button onClick={() => answer(true)} className="btn text-white" style={{ background: GREEN }}>
              Acertei
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function English() {
  const { items, loading, add, update, remove } = useCollection('words')
  const { addXp } = useGame()
  const [tab, setTab] = useState('review')
  const [term, setTerm] = useState('')
  const [meaning, setMeaning] = useState('')
  const [example, setExample] = useState('')
  const [search, setSearch] = useState('')

  const today = dateKey()
  const due = useMemo(
    () => items.filter((w) => w.meaning && (!w.next || w.next <= today)),
    [items, today],
  )
  const [session, setSession] = useState(0)

  const startReview = () => {
    setSession((n) => n + 1)
    setTab('review')
  }

  const submit = async (e) => {
    e.preventDefault()
    const t = term.trim()
    if (!t) return
    setTerm(''); setMeaning(''); setExample('')
    await add({ term: t, meaning: meaning.trim(), example: example.trim(), box: 0, next: '' })
    addXp(5, 'palavra nova')
  }

  const answer = async (word, ok) => {
    const box = ok ? Math.min((word.box || 0) + 1, INTERVALS.length - 1) : 0
    await update(word.id, { box, next: addDaysKey(ok ? INTERVALS[box] : 1) })
    if (ok) addXp(2)
  }

  const filtered = items.filter((w) =>
    (w.term + ' ' + (w.meaning || '')).toLowerCase().includes(search.toLowerCase()),
  )
  const missing = items.filter((w) => !w.meaning).length

  return (
    <div>
      <PageHeader
        title="Inglês"
        subtitle={`${items.length} palavras · ${due.length} para revisar hoje`}
        color={GREEN}
        icon={Languages}
      />

      <form onSubmit={submit} className="card mb-4 grid gap-2 p-3 md:grid-cols-[1fr_1fr_auto]">
        <input className="input" placeholder="Palavra ou expressão" value={term} onChange={(e) => setTerm(e.target.value)} />
        <input className="input" placeholder="Significado" value={meaning} onChange={(e) => setMeaning(e.target.value)} />
        <button className="btn text-white" style={{ background: GREEN }}>Salvar</button>
        <input className="input md:col-span-3" placeholder="Frase de exemplo (opcional)" value={example} onChange={(e) => setExample(e.target.value)} />
      </form>

      <div className="mb-4 flex flex-wrap gap-2">
        <Chip active={tab === 'review'} color={GREEN} onClick={startReview}>Revisar ({due.length})</Chip>
        <Chip active={tab === 'list'} color={GREEN} onClick={() => setTab('list')}>Minhas palavras</Chip>
      </div>

      {loading ? (
        <Spinner />
      ) : tab === 'review' ? (
        <Review key={session} due={due} onAnswer={answer} />
      ) : (
        <>
          {missing > 0 && (
            <p className="mb-3 rounded-2xl bg-accent-100 p-3 text-sm font-semibold text-accent-600">
              {missing} {missing === 1 ? 'palavra está' : 'palavras estão'} sem significado. Complete para entrar na revisão.
            </p>
          )}
          <div className="relative mb-3">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" />
            <input className="input !pl-11" placeholder="Buscar palavra" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          {filtered.length === 0 ? (
            <Empty emoji="🔤" title="Nenhuma palavra ainda" text="Viu uma palavra nova no tradutor? Anote aqui e ela entra na revisão." />
          ) : (
            <div className="flex flex-col gap-2">
              <AnimatePresence initial={false}>
                {filtered.map((w) => (
                  <motion.div key={w.id} layout {...listAnim} className="card flex items-center gap-3 p-4">
                    <button onClick={() => speak(w.term)} className="btn btn-ghost !p-2" title="Ouvir">
                      <Volume2 size={18} />
                    </button>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold">{w.term}</div>
                      <input
                        className="w-full bg-transparent text-sm text-muted outline-none placeholder:text-accent-500"
                        placeholder="Adicionar significado"
                        defaultValue={w.meaning}
                        onBlur={(e) => e.target.value !== (w.meaning || '') && update(w.id, { meaning: e.target.value.trim() })}
                      />
                      {w.example && <div className="text-xs italic text-muted">"{w.example}"</div>}
                    </div>
                    <span className="text-xs font-bold" style={{ color: GREEN }}>nv {w.box || 0}</span>
                    <button onClick={() => remove(w.id)} className="btn btn-ghost !p-2" title="Apagar">
                      <Trash2 size={18} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </>
      )}
    </div>
  )
}
