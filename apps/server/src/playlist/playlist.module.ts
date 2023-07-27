import { Module } from '@nestjs/common'
import { PlaylistService } from './playlist.service'
import { PlaylistController } from './playlist.controller'
import { ChannelModule } from '~/channel/channel.module'

@Module({
  imports: [ChannelModule],
  providers: [PlaylistService],
  controllers: [PlaylistController],
  exports: [PlaylistService],
})
export class PlaylistModule {}
