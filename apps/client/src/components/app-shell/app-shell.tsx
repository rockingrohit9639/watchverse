import { NavLink } from 'react-router-dom'
import { MdOutlineVideoLibrary, MdOutlineSubscriptions } from 'react-icons/md'
import { AiOutlineHome } from 'react-icons/ai'
import clsx from 'clsx'
import Navbar from './components/navbar'

type AppShellProps = {
  children: React.ReactElement
}

export default function AppShell({ children }: AppShellProps) {
  return (
    <div>
      <Navbar />
      <div className="grid grid-cols-12" style={{ marginTop: Navbar.HEIGHT }}>
        <div className="col-span-1">
          <div className="col-span-1 border-r border-gray-50/10 flex-center gap-4 flex-col fixed h-screen w-24">
            <NavLink to="/" className={({ isActive }) => clsx('flex items-center flex-col', isActive && 'text-white')}>
              <AiOutlineHome className="w-5 h-5" />
              <div className="text-xs">Home</div>
            </NavLink>

            <NavLink
              to="/subscriptions"
              className={({ isActive }) => clsx('flex items-center flex-col', isActive && 'text-white')}
            >
              <MdOutlineSubscriptions className="w-5 h-5" />
              <div className="text-xs">Subscriptions</div>
            </NavLink>

            <NavLink
              to="/library"
              className={({ isActive }) => clsx('flex items-center flex-col', isActive && 'text-white')}
            >
              <MdOutlineVideoLibrary className="w-5 h-5" />
              <div className="text-xs">Library</div>
            </NavLink>
          </div>
        </div>
        <div className="col-span-11">{children}</div>
      </div>
    </div>
  )
}
