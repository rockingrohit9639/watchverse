import clsx from 'clsx'
import { useQuery } from 'react-query'
import { Empty, Result } from 'antd'
import { findChanelVideos } from '~/queries/video'
import { QUERY_KEYS } from '~/utils/qk'
import Loading from '../loading'
import { getErrorMessage } from '~/utils/error'
import Video from '../video'

type ChannelVideosProps = {
  className?: string
  style?: React.CSSProperties
  channelId: string
}

export default function ChannelVideos({ className, style, channelId }: ChannelVideosProps) {
  const {
    data: videos,
    isLoading,
    error,
  } = useQuery([QUERY_KEYS['channel-videos'], channelId], () => findChanelVideos(channelId))

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

  if (!videos || videos.length === 0) {
    return (
      <div className="flex-center">
        <Empty description="No videos uploaded yet" />
      </div>
    )
  }

  return (
    <div
      className={clsx(className, 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4')}
      style={style}
    >
      {videos.map((video) => (
        <Video key={video.id} video={video} />
      ))}
    </div>
  )
}
