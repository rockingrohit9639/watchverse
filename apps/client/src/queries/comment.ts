import { Comment, CreateCommentDto } from '~/types/comment'
import { apiClient } from '~/utils/client'

export async function findVideoComments(videoId: string) {
  const { data } = await apiClient.get<Comment[]>(`comment/${videoId}`)
  return data
}

export async function createComment(videoId: string, dto: CreateCommentDto) {
  const { data } = await apiClient.post<Comment>(`comment/${videoId}`, dto)
  return data
}
