import { CreateTagDto, Tag } from '~/types/tag'
import { apiClient } from '~/utils/client'

export async function findTags() {
  const { data } = await apiClient.get<Tag[]>('tags')
  return data
}

export async function createTag(dto: CreateTagDto) {
  const { data } = await apiClient.post<Tag>('tags', dto)
  return data
}
