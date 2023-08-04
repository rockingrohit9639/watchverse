import Navbar from './components/navbar'

type AppShellProps = {
  children: React.ReactElement
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: Navbar.HEIGHT }}>{children}</div>
    </div>
  )
}
