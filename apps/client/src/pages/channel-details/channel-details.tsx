import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { Button, Empty, Result, Tabs } from 'antd'
import { useMemo } from 'react'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useParams } from 'react-router-dom'
import AboutChannel from '~/components/about-channel'
import ChannelPlaylists from '~/components/channel-playlists'
import ChannelVideos from '~/components/channel-videos'
import Loading from '~/components/loading'
import Page from '~/components/page'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { fetchChannelDetails, subscribeChannel } from '~/queries/channel'
import { Channel } from '~/types/channel'
import { ENV } from '~/utils/env'
import { getErrorMessage } from '~/utils/error'
import { QUERY_KEYS } from '~/utils/qk'

export default function ChannelDetails() {
  const { id } = useParams() as { id: string }
  const { data: channel, isLoading, error } = useQuery([QUERY_KEYS.channel, id], () => fetchChannelDetails(id))
  const { user } = useUser()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const isSubscribed = useMemo(() => channel?.subscriberIds.includes(user.id), [channel, user])

  const subscribeChannelMutation = useMutation(subscribeChannel, {
    onError: handleError,
    onSuccess: (updatedChannel) => {
      queryClient.setQueryData<Channel>([QUERY_KEYS.channel, id], (prevData) => {
        if (!prevData) return updatedChannel

        return { ...updatedChannel, subscriberIds: updatedChannel.subscriberIds }
      })
    },
  })

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
          {channel.createdById !== user.id ? (
            <div className="mt-2">
              <Button
                type={isSubscribed ? undefined : 'primary'}
                icon={isSubscribed ? <UserDeleteOutlined /> : <UserAddOutlined />}
                onClick={() => {
                  subscribeChannelMutation.mutate(id)
                }}
                loading={subscribeChannelMutation.isLoading}
                disabled={subscribeChannelMutation.isLoading}
              >
                {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
              </Button>
            </div>
          ) : null}
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
