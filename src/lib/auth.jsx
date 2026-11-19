import { createContext, useContext, useEffect, useState } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut } from 'firebase/auth'
import { auth, googleProvider, allowedEmails } from './firebase'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    return onAuthStateChanged(auth, async (u) => {
      if (u && allowedEmails.length && !allowedEmails.includes((u.email || '').toLowerCase())) {
        setError('Esta conta não tem acesso ao Dimo.')
        await signOut(auth)
        setUser(null)
      } else {
        setUser(u)
      }
      setLoading(false)
    })
  }, [])

  const login = async () => {
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
    } catch (e) {
      if (e.code !== 'auth/popup-closed-by-user') setError('Não foi possível entrar. Tente de novo.')
    }
  }

  const logout = () => signOut(auth)

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
