import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { Empty, Result } from 'antd'
import { findChannelPlaylists } from '~/queries/playlist'
import { QUERY_KEYS } from '~/utils/qk'
import Loading from '../loading'
import { getErrorMessage } from '~/utils/error'
import Playlist from '../playlist'

type ChannelPlaylistsProps = {
  className?: string
  style?: React.CSSProperties
  channelId: string
}

export default function ChannelPlaylists({ className, style, channelId }: ChannelPlaylistsProps) {
  const {
    data: playlists,
    isLoading,
    error,
  } = useQuery([QUERY_KEYS['channel-playlists'], channelId], () => findChannelPlaylists(channelId))

  if (isLoading) {
    return <Loading>Loading Videos</Loading>
  }

  if (error) {
    return (
      <div className="flex-center">
        <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
      </div>
    )
  }

  if (!playlists || playlists.length === 0) {
    return (
      <div className="flex-center">
        <Empty description="No playlists found" />
      </div>
    )
  }

  return (
    <div
      className={clsx(className, 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4')}
      style={style}
    >
      {playlists.map((playlist) => (
        <Playlist key={playlist.id} playlist={playlist} />
      ))}
    </div>
  )
}
