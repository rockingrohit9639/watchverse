import { User } from './user'
import { Video } from './video'

export type Like = {
  id: string
  createdAt: Date
  updatedAt: Date
  video: Video
  videoId: string
  likedBy: User[]
  likedByIds: string[]
}
