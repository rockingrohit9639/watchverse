import { z } from 'zod'

const validationSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
})

export const ENV = validationSchema.parse(import.meta.env)
