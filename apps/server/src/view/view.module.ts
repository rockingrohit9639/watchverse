import { Module } from '@nestjs/common'
import { VideoModule } from '~/video/video.module'
import { ViewController } from './view.controller'
import { ViewService } from './view.service'

@Module({
  imports: [VideoModule],
  controllers: [ViewController],
  providers: [ViewService],
})
export class ViewModule {}
