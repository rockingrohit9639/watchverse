import React, { Suspense } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import AppShell from './components/app-shell'
import AuthProtection from './components/auth-protection'

const Home = React.lazy(() => import('./pages/home'))
const Login = React.lazy(() => import('./pages/login'))
const Signup = React.lazy(() => import('./pages/signup'))
const UploadVideo = React.lazy(() => import('./pages/upload-video'))
const Library = React.lazy(() => import('./pages/library'))
const PlaylistDetails = React.lazy(() => import('./pages/playlist-details'))
const ChannelDetails = React.lazy(() => import('./pages/channel-details'))
const CustomizeChannel = React.lazy(() => import('./pages/customize-channel'))

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
          <Route path="/upload-video" element={<UploadVideo />} />
          <Route path="/library" element={<Library />} />
          <Route path="/playlist/:id" element={<PlaylistDetails />} />
          <Route path="/channel/:id" element={<ChannelDetails />} />
          <Route path="/channel/customize/:id" element={<CustomizeChannel />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Suspense>
  )
}

export default App
