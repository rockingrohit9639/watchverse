import clsx from 'clsx'
import { MdPlaylistPlay } from 'react-icons/md'
import { Link } from 'react-router-dom'
import { Playlist as PlaylistType } from '~/types/playlist'
import { ENV } from '~/utils/env'

type PlaylistProps = {
  className?: string
  style?: React.CSSProperties
  playlist: PlaylistType
}

export default function Playlist({ className, style, playlist }: PlaylistProps) {
  return (
    <div className={clsx('space-y-2', className)} style={style}>
      <div className="overflow-hidden relative">
        <img
          src={`${ENV.VITE_API_BASE_URL}/file/download/${playlist.thumbnailId}`}
          alt="thumbnail"
          className="w-full h-full object-cover aspect-video rounded-lg"
        />
        <div className="absolute bottom-0 px-4 py-1 bg-red-50/20 w-full rounded-br-lg rounded-bl-lg flex items-center justify-between">
          <div>
            <MdPlaylistPlay />
          </div>
          <div>{playlist.videoIds.length} Videos</div>
        </div>
      </div>
      <div>
        <div className="text-lg font-medium">{playlist.title}</div>
        <div className="mb-2 text-gray-400/60">{playlist.channel.name}</div>
        <Link to={`/playlist/${playlist.id}`}>View full playlist</Link>
      </div>
    </div>
  )
}
