import axios from 'axios'
import { LoginDto, SignupDto } from '~/types/auth'
import { User } from '~/types/user'
import { apiClient } from '~/utils/client'
import { ENV } from '~/utils/env'

export type LoginResponse = { accessToken: string; user: User }

export async function fetchLoggedInUser() {
  const { data } = await apiClient.get<User>('auth/me')
  return data
}

export async function login(dto: LoginDto) {
  const { data } = await apiClient.post<LoginResponse>('auth/login', dto)
  return data
}

export async function signup(dto: SignupDto) {
  const { data } = await apiClient.post<{ accessToken: string; user: User }>('auth/signup', dto)
  return data
}

export async function signInUsingAccessToken(accessToken: string) {
  const { data } = await axios.get<User>(`${ENV.VITE_API_BASE_URL}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  })
  return {
    user: data,
    accessToken,
  }
}
