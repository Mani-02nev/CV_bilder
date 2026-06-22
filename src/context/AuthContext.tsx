import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
    session: Session | null
    user: User | null
    loading: boolean
    signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
    session: null,
    user: null,
    loading: true,
    signOut: async () => { },
})

export function AuthProvider({ children }: { children: ReactNode }) {
    const [session, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<User | null>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        supabase.auth.getSession()
            .then(({ data: { session }, error }) => {
                if (error) {
                    console.warn('Supabase session recovery issue:', error.message)
                    if (error.message?.includes('Refresh Token')) {
                        supabase.auth.signOut().catch(() => {})
                    }
                }
                setSession(session)
                setUser(session?.user ?? null)
                setLoading(false)
            })
            .catch((err) => {
                console.error('Unhandled getSession error:', err)
                setLoading(false)
            })

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
            setUser(session?.user ?? null)
            setLoading(false)
        })

        return () => subscription.unsubscribe()
    }, [])

    const signOut = async () => {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    }

    return (
        <AuthContext.Provider value={{ session, user, loading, signOut }}>
            {!loading && children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    return useContext(AuthContext)
}
