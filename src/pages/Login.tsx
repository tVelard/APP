import { Navigate } from 'react-router-dom'
import { LoginForm } from '@/components/auth/LoginForm'
import { useAuthContext } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

export function LoginPage() {
  const { user, loading } = useAuthContext()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
      </div>
    )
  }

  if (user) {
    return <Navigate to="/" replace />
  }

  return <LoginForm />
}
