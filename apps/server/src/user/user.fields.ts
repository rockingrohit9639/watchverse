import { Prisma } from '@prisma/client'

export const USER_SELECT_FIELDS = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
  channelSubscribedIds: true,
  likedVideoIds: true,
  viewsIds: true,
} satisfies Prisma.UserSelect
