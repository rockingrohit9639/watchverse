import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { configOptions } from './config/config.options'
import { UserModule } from './user/user.module'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { FileModule } from './file/file.module'
import { ChannelModule } from './channel/channel.module'
import { VideoModule } from './video/video.module'
import { PlaylistModule } from './playlist/playlist.module'
import { LikeModule } from './like/like.module'
import { CommentModule } from './comment/comment.module'
import { ViewModule } from './view/view.module'
import { NotificationModule } from './notification/notification.module'
import { TagModule } from './tag/tag.module'

@Module({
  imports: [
    ConfigModule.forRoot(configOptions),
    PrismaModule,
    AuthModule,
    UserModule,
    FileModule,
    ChannelModule,
    VideoModule,
    PlaylistModule,
    LikeModule,
    CommentModule,
    ViewModule,
    NotificationModule,
    TagModule,
  ],
  providers: [],
})
export class AppModule {}
