import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { Button, Empty, Result, Tabs } from 'antd'
import { useQuery } from 'react-query'
import { useParams } from 'react-router-dom'
import AboutChannel from '~/components/about-channel'
import ChannelPlaylists from '~/components/channel-playlists'
import ChannelVideos from '~/components/channel-videos'
import Loading from '~/components/loading'
import Page from '~/components/page'
import { useUser } from '~/hooks/use-user'
import { fetchChannelDetails } from '~/queries/channel'
import { ENV } from '~/utils/env'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export default function ChannelDetails() {
  const { id } = useParams() as { id: string }
  const { data: channel, isLoading, error } = useQuery([QUERY_KEYS.channel, id], () => fetchChannelDetails(id))
  const { user } = useUser()

  if (isLoading) {
    return <Loading>Fetching channel details...</Loading>
  }

  if (error) {
    return (
      <div className="w-full h-full flex-center">
        <Result status="error" title="Something went wrong" subTitle={getErrorMessage(error)} />
      </div>
    )
  }

  if (!channel) {
    return <Empty description="No channel found" />
  }

  return (
    <div>
      <img src="/watchverse-banner.jpg" alt="banner" className="h-52 w-full object-cover" />
      <Page className="grid grid-cols-3">
        {/* Channel Logo */}
        <div className="w-56 h-56">
          <img
            src={`${ENV.VITE_API_BASE_URL}/file/download/${channel.logoId}`}
            className="rounded-full w-full h-full object-cover"
            alt={channel.name}
          />
        </div>
        {/* Channel Logo */}
        <div className="col-span-2 flex flex-col justify-center gap-1">
          <div className="text-2xl font-bold text-white">{channel.name}</div>
          <div className="flex">
            <div className="text-text-secondary">{channel.subscriberIds.length} Subscribers</div>
          </div>
          <div className="text-text-secondary">{channel.description}</div>
          <div className="mt-2">
            {channel.subscriberIds.includes(user.id) ? (
              <Button icon={<UserDeleteOutlined />}>Unsubscribe</Button>
            ) : (
              <Button type="primary" icon={<UserAddOutlined />}>
                Subscribe
              </Button>
            )}
          </div>
        </div>

        {/* Channel's Other Details */}
        <Tabs className="col-span-full">
          <Tabs.TabPane key="videos" tab="Videos">
            <ChannelVideos channelId={id} />
          </Tabs.TabPane>

          <Tabs.TabPane key="playlists" tab="Playlists">
            <ChannelPlaylists channelId={id} />
          </Tabs.TabPane>

          <Tabs.TabPane key="about" tab="About">
            <AboutChannel channel={channel} />
          </Tabs.TabPane>
        </Tabs>
      </Page>
    </div>
  )
}
