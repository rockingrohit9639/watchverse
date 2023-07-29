import { Navigate, useLocation } from 'react-router-dom'

type AuthProtectionProps = {
  children: React.ReactElement
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const location = useLocation()
  /** @TODO Check for you own user */
  const user = true

  if (user) {
    return children
  }

  return <Navigate to={{ pathname: '/login', search: `redirectTo=${location.pathname}` }} />
}
