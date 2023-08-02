import { Channel, CreateChannelDto } from '~/types/channel'
import { apiClient } from '~/utils/client'

export async function createChannel(dto: CreateChannelDto) {
  const { data } = await apiClient.post<Channel>('channel', dto)
  return data
}

export async function fetchUserChannels() {
  const { data } = await apiClient.get<Channel[]>('channel')
  return data
}

export async function updateActiveChannel(id: string) {
  const { data } = await apiClient.post<{ previousActive: Channel; newActive: Channel }>(`channel/active/${id}`)
  return data
}