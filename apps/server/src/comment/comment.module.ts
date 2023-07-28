import { Module } from '@nestjs/common'
import { VideoModule } from '~/video/video.module'
import { CommentController } from './comment.controller'
import { CommentService } from './comment.service'

@Module({
  imports: [VideoModule],
  controllers: [CommentController],
  providers: [CommentService],
})
export class CommentModule {}
