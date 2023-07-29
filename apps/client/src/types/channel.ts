import { User } from './user'

export type Channel = {
  id: string
  name: string
  description: string
  logoId: string
  bannerId?: string
  createdBy: User
  createdAt: string
  updatedAt: string
}

export type CreateChannelDto = Pick<Channel, 'name' | 'description'> & {
  logo: string
  banner?: string
}
