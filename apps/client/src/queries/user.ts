import { UpdateProfileDto, User } from '~/types/user'
import { apiClient } from '~/utils/client'

export async function updateProfile(id: string, dto: UpdateProfileDto) {
  const { data } = await apiClient.patch<User>(`user/${id}`, dto)
  return data
}
