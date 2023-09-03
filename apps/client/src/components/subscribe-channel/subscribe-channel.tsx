import { UserAddOutlined, UserDeleteOutlined } from '@ant-design/icons'
import { Button } from 'antd'
import { useMemo } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import useError from '~/hooks/use-error'
import { useUser } from '~/hooks/use-user'
import { subscribeChannel } from '~/queries/channel'
import { Channel } from '~/types/channel'
import { QUERY_KEYS } from '~/utils/qk'

type SubscribeChannelProps = {
  channel: Channel
}

export default function SubscribeChannel({ channel }: SubscribeChannelProps) {
  const { user } = useUser()
  const { handleError } = useError()
  const queryClient = useQueryClient()

  const isSubscribed = useMemo(() => channel?.subscriberIds.includes(user.id), [channel, user])

  const subscribeChannelMutation = useMutation(subscribeChannel, {
    onError: handleError,
    onSuccess: (updatedChannel) => {
      queryClient.setQueryData<Channel>([QUERY_KEYS.channel, channel.id], (prevData) => {
        if (!prevData) return updatedChannel

        return { ...updatedChannel, subscriberIds: updatedChannel.subscriberIds }
      })
    },
  })

  return channel.createdById !== user.id ? (
    <div className="mt-2">
      <Button
        type={isSubscribed ? undefined : 'primary'}
        icon={isSubscribed ? <UserDeleteOutlined /> : <UserAddOutlined />}
        onClick={() => {
          subscribeChannelMutation.mutate(channel.id)
        }}
        loading={subscribeChannelMutation.isLoading}
        disabled={subscribeChannelMutation.isLoading}
      >
        {isSubscribed ? 'Unsubscribe' : 'Subscribe'}
      </Button>
    </div>
  ) : null
}
