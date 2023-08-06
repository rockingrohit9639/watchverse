import { User } from './user'
import { Video } from './video'

export type Channel = {
  id: string
  name: string
  description: string
  logoId: string
  bannerId?: string
  isActive: boolean
  createdBy: User
  createdById: string
  createdAt: string
  updatedAt: string
  videos: Video[]
  subscribers: User[]
  subscriberIds: string[]
}

export type CreateChannelDto = Pick<Channel, 'name' | 'description'> & {
  logo: string
  banner?: string
}

export type ChannelStats = {
  joinedAt: Date
  totalVideos: number
  totalViews: number
  totalSubscribers: number
}

export type UpdateChannelDto = Pick<Channel, 'name' | 'description'> & {
  logo?: string
  banner?: string
}
