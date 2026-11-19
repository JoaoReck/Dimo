import { useEffect, useMemo, useState } from 'react'
import {
  addDoc, collection, deleteDoc, doc, onSnapshot, orderBy, query, updateDoc,
} from 'firebase/firestore'
import { db } from './firebase'
import { useAuth } from './auth'

// Coleção privada do usuário logado: users/{uid}/{name}
export function useCollection(name) {
  const { user } = useAuth()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, 'users', user.uid, name), orderBy('created', 'desc'))
    return onSnapshot(
      q,
      (snap) => {
        setItems(snap.docs.map((d) => ({ id: d.id, ...d.data() })))
        setLoading(false)
      },
      () => setLoading(false),
    )
  }, [user, name])

  const actions = useMemo(() => {
    const base = () => collection(db, 'users', user.uid, name)
    return {
      add: (data) => addDoc(base(), { ...data, created: Date.now() }),
      update: (id, data) => updateDoc(doc(db, 'users', user.uid, name, id), data),
      remove: (id) => deleteDoc(doc(db, 'users', user.uid, name, id)),
    }
  }, [user, name])

  return { items, loading, ...actions }
}
