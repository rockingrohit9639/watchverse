import { LikeOutlined, ShareAltOutlined } from '@ant-design/icons'
import { Avatar, Empty, Result } from 'antd'
import moment from 'moment'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import Loading from '~/components/loading'
import Page from '~/components/page'
import SubscribeChannel from '~/components/subscribe-channel'
import VideoComments from '~/components/video-comments'
import VideoPlayer from '~/components/video-player'
import { findVideoDetails } from '~/queries/video'
import { ENV } from '~/utils/env'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export default function VideoDetails() {
  const { id } = useParams() as { id: string }
  const { data: video, isLoading, error } = useQuery([QUERY_KEYS.video, id], () => findVideoDetails(id))

  if (isLoading) {
    return <Loading>Loading video...</Loading>
  }

  if (error) {
    return <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
  }

  if (!video) {
    return <Empty description="Video details not found" />
  }

  return (
    <Page className="grid grid-cols-3 gap-4">
      <div className="col-span-full sm:col-span-2 space-y-4">
        <div className="flex-center">
          <VideoPlayer url={`${ENV.VITE_API_BASE_URL}/video/stream/${video.videoId}`} />
        </div>
        <div className="text-lg font-bold">{video.title}</div>
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2 space-y-2">
            <Avatar className="uppercase" src={`${ENV.VITE_API_BASE_URL}/file/download/${video.channel.logoId}`}>
              {video.channel.name[0]}
            </Avatar>
            <div>
              <div>{video.channel.name}</div>
              <div className="text-sm text-text-secondary">{video.channel.subscriberIds.length} Subscribers</div>
            </div>
          </div>

          <SubscribeChannel channel={video.channel} />

          <div className="bg-gray-500/10 px-4 py-2 gap-2 rounded-full flex-center cursor-pointer">
            <div>
              <LikeOutlined />
            </div>
            <div className="text-sm">{video.likes} Likes</div>
          </div>

          <div className="bg-gray-500/10 p-2 rounded-full w-10 h-10 flex-center cursor-pointer">
            <ShareAltOutlined />
          </div>
        </div>

        <div className="p-4 bg-gray-500/10 rounded-lg space-y-4">
          <div className="flex items-center gap-2 text-gray-500">
            <div>{video.views} views</div>
            <div>{moment(video.createdAt).fromNow()}</div>
          </div>
          <div>{video.description}</div>
        </div>

        <VideoComments videoId={video.id} />
      </div>

      <div className="hidden sm:block">Suggestions</div>
    </Page>
  )
}
