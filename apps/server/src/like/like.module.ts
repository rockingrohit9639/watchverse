import { Module } from '@nestjs/common'
import { LikeController } from './like.controller'
import { LikeService } from './like.service'
import { VideoModule } from '~/video/video.module'

@Module({
  imports: [VideoModule],
  controllers: [LikeController],
  providers: [LikeService],
})
export class LikeModule {}
