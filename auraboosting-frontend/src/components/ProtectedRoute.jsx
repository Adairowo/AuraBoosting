import { useEffect } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import Spinner from './Spinner.jsx'

function ProtectedRoute({ children, roles }) {
  const location = useLocation()
  const { token, user, status, bootstrap } = useAuthStore()

  useEffect(() => {
    if (status === 'idle') {
      bootstrap()
    }
  }, [bootstrap, status])

  if (status === 'idle' || status === 'loading') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-base-content">
        <Spinner />
        <p className="text-sm opacity-70">Validando sesión...</p>
      </div>
    )
  }

  if (!token || status === 'unauthenticated') {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (roles && user && !roles.includes(user.role)) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default ProtectedRoute
