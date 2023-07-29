import { Module } from '@nestjs/common'
import { ChannelController } from './channel.controller'
import { ChannelService } from './channel.service'
import { FileModule } from '~/file/file.module'
import { NotificationModule } from '~/notification/notification.module'

@Module({
  imports: [FileModule, NotificationModule],
  controllers: [ChannelController],
  providers: [ChannelService],
  exports: [ChannelService],
})
export class ChannelModule {}
