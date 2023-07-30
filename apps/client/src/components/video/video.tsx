import { MoreOutlined } from '@ant-design/icons'
import { Avatar } from 'antd'
import clsx from 'clsx'
import moment from 'moment'
import { Link } from 'react-router-dom'
import { Video as VideoType } from '~/types/video'
import { ENV } from '~/utils/env'

type VideoProps = {
  className?: string
  style?: React.CSSProperties
  video: VideoType
}

export default function Video({ className, style, video }: VideoProps) {
  return (
    <div className={clsx('space-y-2 cursor-pointer video-box group', className)} style={style}>
      <Link to={`/video/${video.id}`}>
        <img
          src={`${ENV.VITE_API_BASE_URL}/file/download/${video.thumbnailId}`}
          className="aspect-video object-cover rounded-lg"
        />
      </Link>

      <div className="flex justify-between">
        <div className="flex gap-2">
          <Avatar src={`${ENV.VITE_API_BASE_URL}/file/download/${video.uploadedById}`}>U</Avatar>
          <div className="font-bold">{video.title}</div>
        </div>
        <div className="opacity-0 group-hover:opacity-100">
          <MoreOutlined />
        </div>
      </div>

      <div>
        <div>{video.channel.name}</div>
        <div className="flex gap-2">
          <div>{video.views} views</div>
          <div>{moment(video.createdAt).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}
