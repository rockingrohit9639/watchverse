import { Avatar, Tooltip } from 'antd'
import clsx from 'clsx'
import { BellOutlined } from '@ant-design/icons'
import { AiOutlineVideoCameraAdd } from 'react-icons/ai'

type NavbarProps = {
  className?: string
  style?: React.CSSProperties
}

const NAVBAR_HEIGHT = 60

export default function Navbar({ className, style }: NavbarProps) {
  return (
    <div
      className={clsx(className, 'border-b border-gray-50/10 fixed w-full top-0 left-0 z-10 bg-background')}
      style={{ ...style, height: NAVBAR_HEIGHT }}
    >
      <div className="max-w-screen-lg mx-auto w-full px-4  h-full  flex items-center justify-between">
        <div className="text-xl font-bold text-primary">Watchverse</div>
        <div className="flex items-center gap-2">
          <Tooltip title="Upload Video">
            <div className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-50/10 flex-center">
              <AiOutlineVideoCameraAdd />
            </div>
          </Tooltip>

          <Tooltip title="Notification">
            <div className="cursor-pointer w-8 h-8 rounded-full hover:bg-gray-50/10 flex-center">
              <BellOutlined />
            </div>
          </Tooltip>

          <Avatar>R</Avatar>
        </div>
      </div>
    </div>
  )
}

Navbar.HEIGHT = NAVBAR_HEIGHT
