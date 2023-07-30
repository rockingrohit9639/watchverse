import { Prisma } from '@prisma/client'

export const VIDEO_INCLUDE_FIELDS = {
  channel: true,
} satisfies Prisma.VideoInclude
