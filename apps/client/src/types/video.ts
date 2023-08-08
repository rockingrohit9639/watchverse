import { Channel } from './channel'
import { File } from './file'
import { Tag } from './tag'
import { User } from './user'

export const Visibility = {
  PRIVATE: 'PRIVATE',
  PUBLIC: 'PUBLIC',
}

export type Video = {
  id: string
  title: string
  description: string
  visibility: keyof typeof Visibility
  video: File
  videoId: string
  likes: number
  views: number
  uploadedBy: User
  uploadedById: string
  channel: Channel
  channelId: string
  thumbnail: File
  thumbnailId: string
  createdAt: Date
  updatedAt: Date
  tags: Tag[]
}

export type UploadVideoDto = Pick<Video, 'title' | 'description' | 'visibility'> & {
  video: string
  thumbnail: string
  tags: string[]
}

export type UpdateVideoDto = Pick<Video, 'title' | 'description' | 'visibility'> & {
  thumbnail: string
}
