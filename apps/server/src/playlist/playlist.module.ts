import { Module } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { ChannelModule } from '~/channel/channel.module'
import { FileModule } from '~/file/file.module'

@Module({
  imports: [ChannelModule, FileModule],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
