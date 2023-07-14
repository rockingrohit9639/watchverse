import axios from 'axios'
import { QueryClient } from 'react-query'
import { ENV } from './env'

export const apiClient = axios.create({
  baseURL: ENV.VITE_API_BASE_URL,
})

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
})
