import { CreateChannelDto } from '~/types/channel'
import { apiClient } from '~/utils/client'

export async function createChannel(dto: CreateChannelDto) {
  const { data } = await apiClient.post('channel', dto)
  return data
}
