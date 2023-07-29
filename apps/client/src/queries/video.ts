import { UploadVideoDto, Video } from '~/types/video'
import { apiClient } from '~/utils/client'

export async function uploadVideo(dto: UploadVideoDto) {
  const { data } = await apiClient.post<Video>('video', dto)
  return data
}
