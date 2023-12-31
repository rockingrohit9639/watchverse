import { z } from 'zod'

const validationSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_BEARER_TOKEN_KEY: z.string(),
  VITE_NOVU_APP_IDENTIFIER: z.string(),
})

export const ENV = validationSchema.parse(import.meta.env)
