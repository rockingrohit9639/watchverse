import { LoginDto } from '~/types/auth'
import { User } from '~/types/user'
import { apiClient } from '~/utils/client'

export async function fetchLoggedInUser() {
  const { data } = await apiClient.get<User>('auth/me')
  return data
}

export async function login(dto: LoginDto) {
  const { data } = await apiClient.post<{ accessToken: string; user: User }>('auth/login', dto)
  return data
}
