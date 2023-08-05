import { CreatePlaylistDto, Playlist } from '~/types/playlist'
import { apiClient } from '~/utils/client'

export async function createPlaylist(dto: CreatePlaylistDto) {
  const { data } = await apiClient.post<Playlist>('playlist', dto)
  return data
}

export async function findActiveChannelPlaylists() {
  const { data } = await apiClient.get<Playlist[]>('playlist')
  return data
}

export async function findPlaylist(id: string) {
  const { data } = await apiClient.get<Playlist>(`playlist/${id}`)
  return data
}

export async function findChannelPlaylists(channelId: string) {
  const { data } = await apiClient.get<Playlist[]>(`playlist/channel/${channelId}`)
  return data
}
