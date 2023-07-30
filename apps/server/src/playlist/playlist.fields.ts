import { Prisma } from '@prisma/client'

export const PLAYLIST_INCLUDE = {
  channel: true,
} satisfies Prisma.PlaylistInclude
