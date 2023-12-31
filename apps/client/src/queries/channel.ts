import { Channel, ChannelStats, CreateChannelDto, UpdateChannelDto } from '~/types/channel'
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

export async function fetchChannelDetails(id: string) {
  const { data } = await apiClient.get<Channel>(`channel/${id}`)
  return data
}

export async function fetchChannelStats(id: string) {
  const { data } = await apiClient.get<ChannelStats>(`channel/stats/${id}`)
  return data
}

export async function subscribeChannel(id: string) {
  const { data } = await apiClient.post<Channel>(`channel/subscribe/${id}`)
  return data
}

export async function updateChannel(id: string, dto: UpdateChannelDto) {
  const { data } = await apiClient.patch(`channel/${id}`, dto)
  return data
}
