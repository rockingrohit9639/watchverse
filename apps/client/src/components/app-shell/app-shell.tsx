import { NovuProvider } from '@novu/notification-center'
import Navbar from './components/navbar'
import { useUser } from '~/hooks/use-user'
import { ENV } from '~/utils/env'

type AppShellProps = {
  children: React.ReactElement
}

export default function AppShell({ children }: AppShellProps) {
  const { user } = useUser()

  return (
    <div>
      <NovuProvider subscriberId={user.id} applicationIdentifier={ENV.VITE_NOVU_APP_IDENTIFIER}>
        <Navbar />
        <div style={{ marginTop: Navbar.HEIGHT }}>{children}</div>
      </NovuProvider>
    </div>
  )
}
