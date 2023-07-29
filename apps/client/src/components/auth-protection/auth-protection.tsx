import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '~/hooks/use-auth'

type AuthProtectionProps = {
  children: React.ReactElement
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const location = useLocation()
  const { user } = useAuth()

  if (user) {
    return children
  }

  return <Navigate to={{ pathname: '/login', search: `redirectTo=${location.pathname}` }} />
}
