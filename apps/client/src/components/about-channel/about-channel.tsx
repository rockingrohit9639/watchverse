import clsx from 'clsx'
import { useQuery } from '@tanstack/react-query'
import { Result } from 'antd'
import moment from 'moment'
import { fetchChannelStats } from '~/queries/channel'
import { Channel } from '~/types/channel'
import { QUERY_KEYS } from '~/utils/qk'
import Loading from '../loading'
import { getErrorMessage } from '~/utils/error'
import { DATE_FORMAT } from '~/utils/constants'

type AboutChannelProps = {
  className?: string
  style?: React.CSSProperties
  channel: Channel
}

export default function AboutChannel({ className, style, channel }: AboutChannelProps) {
  const {
    data: stats,
    isLoading,
    error,
  } = useQuery([QUERY_KEYS['channel-stats'], channel.id], () => fetchChannelStats(channel.id))

  if (isLoading) {
    return <Loading>Fetching channel stats...</Loading>
  }

  if (error) {
    return (
      <div className="w-full h-full flex-center">
        <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
      </div>
    )
  }

  return (
    <div className={clsx(className, 'grid grid-cols-3 gap-4')} style={style}>
      <div className="col-span-2 divide-y-2 divide-gray-500/20 space-y-4">
        <div>
          <div className="text-lg text-white">Description</div>
          <div>{channel.description}</div>
        </div>
        <div className="py-2">
          <div>Details</div>
          <div>Location : India</div>
        </div>
      </div>
      <div className="space-y-2 divide-y-2 divide-gray-500/20">
        <div className="text-lg text-white">Stats</div>
        <div className="py-2">Joined {stats?.joinedAt ? moment(stats.joinedAt).format(DATE_FORMAT) : null}</div>
        <div className="py-2">{stats?.totalVideos} Videos</div>
        <div className="py-2">{stats?.totalViews} Views</div>
        <div className="py-2">{stats?.totalSubscribers} Subscribers</div>
      </div>
    </div>
  )
}
