import { Module } from '@nestjs/common'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'
import { FileModule } from '~/file/file.module'
import { ChannelModule } from '~/channel/channel.module'

@Module({
  imports: [FileModule, ChannelModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
