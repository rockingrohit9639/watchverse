import { Prisma } from '@prisma/client'
import { USER_SELECT_FIELDS } from '~/user/user.fields'

export const COMMENT_INCLUDE_FIELDS = {
  createdBy: { select: USER_SELECT_FIELDS },
} satisfies Prisma.CommentInclude
