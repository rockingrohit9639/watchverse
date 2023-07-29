import { Spin } from 'antd'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '~/hooks/use-auth'

type AuthProtectionProps = {
  children: React.ReactElement
}

export default function AuthProtection({ children }: AuthProtectionProps) {
  const location = useLocation()
  const { user, authVerificationInProgress } = useAuth()

  if (authVerificationInProgress) {
    return (
      <div className="flex items-center justify-center w-full h-screen">
        <Spin>Authentication in progress...</Spin>
      </div>
    )
  }

  if (user) {
    return children
  }

  return <Navigate to={{ pathname: '/login', search: `redirectTo=${location.pathname}` }} />
}
