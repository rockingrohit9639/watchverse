import { Module } from '@nestjs/common'
import { VideoController } from './video.controller'
import { VideoService } from './video.service'
import { FileModule } from '~/file/file.module'
import { ChannelModule } from '~/channel/channel.module'
import { PlaylistModule } from '~/playlist/playlist.module'
import { NotificationModule } from '~/notification/notification.module'

@Module({
  imports: [FileModule, ChannelModule, PlaylistModule, NotificationModule],
  controllers: [VideoController],
  providers: [VideoService],
  exports: [VideoService],
})
export class VideoModule {}
