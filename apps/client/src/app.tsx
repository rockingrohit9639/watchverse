import React, { Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import AppShell from './components/app-shell'
import AuthProtection from './components/auth-protection'

const Home = React.lazy(() => import('./pages/home'))
const Login = React.lazy(() => import('./pages/login'))

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
          <Route path="/" element={<Home />} />
        </Route>

        <Route path="/login" element={<Login />} />
      </Routes>
    </Suspense>
  )
}

export default App
