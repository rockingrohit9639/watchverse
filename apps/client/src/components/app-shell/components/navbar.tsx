import { Avatar, Dropdown, Tooltip } from 'antd'
import clsx from 'clsx'
import { BellOutlined, PlusOutlined, UserOutlined } from '@ant-design/icons'
import { AiOutlineVideoCameraAdd } from 'react-icons/ai'
import { useUser } from '~/hooks/use-user'
import UpdateProfileModal from '~/components/update-profile-modal'
import { ENV } from '~/utils/env'
import CreateChannelModal from '~/components/create-channel-modal'

type NavbarProps = {
  className?: string
  style?: React.CSSProperties
}

const NAVBAR_HEIGHT = 60

export default function Navbar({ className, style }: NavbarProps) {
  const { user } = useUser()

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

          <Dropdown
            trigger={['click']}
            dropdownRender={(menu) => (
              <div className="bg-base rounded">
                <div className="px-4 py-2">{user.name}</div>
                {menu}
              </div>
            )}
            menu={{
              items: [
                {
                  key: 'update-profile',
                  label: <UpdateProfileModal trigger={<div>Update Profile</div>} />,
                  icon: <UserOutlined />,
                },
                {
                  key: 'create-channel',
                  label: <CreateChannelModal trigger={<div>Create Channel</div>} />,
                  icon: <PlusOutlined />,
                },
              ],
            }}
          >
            <Avatar
              className="cursor-pointer uppercase"
              src={`${ENV.VITE_API_BASE_URL}/file/download/${user.pictureId}`}
            >
              {user.name[0]}
            </Avatar>
          </Dropdown>
        </div>
      </div>
    </div>
  )
}

Navbar.HEIGHT = NAVBAR_HEIGHT
