import { Channel } from './channel'
import { User } from './user'
import { Video, Visibility } from './video'

export type Playlist = {
  id: string
  createdAt: Date
  updatedAt: Date
  title: string
  description?: string
  visibility: keyof typeof Visibility
  createdBy: User
  createdById: string
  channel: Channel
  channelId: string
  videos: Video[]
  videoIds: string[]
}

export type CreatePlaylistDto = Pick<Playlist, 'title' | 'description' | 'visibility'>
export type UpdatePlaylistDto = Partial<CreatePlaylistDto>
