import { User } from './user'

export type File = {
  id: string
  originalName: string
  encoding: string
  mimeType: string
  filename: string
  size: number
  createdAt: string
  updatedAt: string
  uploadedBy: User
  uploadedById: string
}
