import { apiClient } from '~/utils/client'

export async function updateView(videoId: string) {
  const { data } = await apiClient.post(`view/${videoId}`)
  return data
}
