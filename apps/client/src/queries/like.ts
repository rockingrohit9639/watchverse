import { Like } from '~/types/like'
import { apiClient } from '~/utils/client'

export async function getLikeDocumentForVideo(videoId: string) {
  const { data } = await apiClient.get<Like>(`like/${videoId}`)
  return data
}

export async function likeOrUnlike(videoId: string) {
  const { data } = await apiClient.post<Like>(`like/${videoId}`)
  return data
}
