import { useState, useEffect, useCallback } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthState {
  user: User | null
  loading: boolean
  error: AuthError | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    loading: true,
    error: null,
  })

  useEffect(() => {
    // Récupérer la session initiale
    supabase.auth.getSession().then(({ data: { session } }) => {
      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        loading: false,
      }))
    })

    // Écouter les changements d'authentification
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          loading: false,
        }))
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    setState(prev => ({ ...prev, loading: false }))

    if (error) {
      console.error('SignIn error:', error)
      setState(prev => ({ ...prev, error }))
      return { error }
    }

    return { error: null }
  }, [])

  const signUp = useCallback(async (email: string, password: string, displayName?: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    console.log('Attempting signUp for:', email)

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: displayName,
        },
      },
    })

    setState(prev => ({ ...prev, loading: false }))

    if (error) {
      console.error('SignUp error:', error)
      setState(prev => ({ ...prev, error }))
      return { error, needsConfirmation: false }
    }

    console.log('SignUp response:', { user: data.user?.id, session: !!data.session })

    // Si l'utilisateur existe mais pas de session, email de confirmation requis
    if (data.user && !data.session) {
      console.log('SignUp success - email confirmation required')
      return { error: null, needsConfirmation: true }
    }

    // Si session existe, l'utilisateur est directement connecté (confirmation email désactivée)
    if (data.session) {
      console.log('SignUp success - user logged in directly')
      return { error: null, needsConfirmation: false }
    }

    return { error: null, needsConfirmation: false }
  }, [])

  const signOut = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }))

    const { error } = await supabase.auth.signOut()

    if (error) {
      setState(prev => ({ ...prev, loading: false, error }))
      return { error }
    }

    return { error: null }
  }, [])

  const resetPassword = useCallback(async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    return { error }
  }, [])

  return {
    user: state.user,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
