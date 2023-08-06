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
  moreContent?: React.ReactNode
}

export default function Video({ className, style, video, moreContent }: VideoProps) {
  return (
    <div
      className={clsx(
        'space-y-2 cursor-pointer group border border-gray-50/10 rounded-lg bg-gray-500/10 h-min',
        className,
      )}
      style={style}
    >
      <div className="flex items-center gap-2 p-4">
        <Avatar src={`${ENV.VITE_API_BASE_URL}/file/download/${video.uploadedById}`} className="w-8 h-8">
          {video.channel.name[0]}
        </Avatar>

        <Link to={`/channel/${video.channelId}`} title={video.channel.name}>
          {video.channel.name}
        </Link>
      </div>

      <Link to={`/video/${video.id}`} title={video.title}>
        <img
          src={`${ENV.VITE_API_BASE_URL}/file/download/${video.thumbnailId}`}
          className="aspect-video object-cover rounded-lg"
        />
      </Link>

      <div className="p-4 space-y-2">
        <div className="flex justify-between">
          <div className="font-bold">{video.title}</div>
          <div className="opacity-0 group-hover:opacity-100">{moreContent}</div>
        </div>

        <div className="flex gap-2">
          <div>{video.views} views</div>
          <div>{moment(video.createdAt).fromNow()}</div>
        </div>
      </div>
    </div>
  )
}
