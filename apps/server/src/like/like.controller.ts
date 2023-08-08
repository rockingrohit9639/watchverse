import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common'
import { Like } from '@prisma/client'
import { LikeService } from './like.service'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('like')
export class LikeController {
  constructor(private readonly likeService: LikeService) {}

  @Post(':videoId')
  likeOrUnlike(@Param('videoId') videoId: string, @GetUser() user: SanitizedUser): Promise<Like> {
    return this.likeService.likeOrUnlike(videoId, user)
  }

  @Get(':videoId')
  getLikeDocument(@Param('videoId') id: string): Promise<Like> {
    return this.likeService.getLikeDocument(id)
  }
}
