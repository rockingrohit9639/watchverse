import { User } from './user'
import { Video } from './video'

export type Comment = {
  id: string
  createdAt: Date
  updatedAt: Date
  content: string
  video: Video
  videoId: string
  createdBy: User
  createdById: string
}

export type CreateCommentDto = Pick<Comment, 'content'>
