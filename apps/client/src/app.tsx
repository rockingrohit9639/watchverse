import { Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import AppShell from './components/app-shell'
import AuthProtection from './components/auth-protection'

function App() {
  return (
    <Suspense
      fallback={
        <div className="flex h-screen w-full items-center justify-center">
          <div>Login please wait.</div>
        </div>
      }
    >
      <Routes>
        <Route
          element={
            <AuthProtection>
              <AppShell>
                <Outlet />
              </AppShell>
            </AuthProtection>
          }
        >
          {/* Add authenticated routes here (e.g. dashboard, profile, etc.) */}
        </Route>

        {/* Add unauthenticated routes here (e.g. login, signup) */}
      </Routes>
    </Suspense>
  )
}

export default App
