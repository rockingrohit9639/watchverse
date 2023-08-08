import { Controller, Param, Post, UseGuards } from '@nestjs/common'
import { View } from '@prisma/client'
import { ViewService } from './view.service'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('view')
export class ViewController {
  constructor(private readonly viewService: ViewService) {}

  @Post(':videoId')
  updateViewCount(@Param('videoId') videoId: string, @GetUser() user: SanitizedUser): Promise<View> {
    return this.viewService.updateViewCount(videoId, user)
  }
}
