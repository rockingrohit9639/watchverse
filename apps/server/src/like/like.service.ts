import { ForbiddenException, Injectable } from '@nestjs/common'
import { Like } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { SanitizedUser } from '~/user/user.types'
import { VideoService } from '~/video/video.service'

@Injectable()
export class LikeService {
  constructor(private readonly prismaService: PrismaService, private readonly videoService: VideoService) {}

  async likeOrUnlike(videoId: string, user: SanitizedUser): Promise<Like> {
    const video = await this.videoService.findOneById(videoId)
    if (video.uploadedById === user.id) {
      throw new ForbiddenException('You cannot like you own video!')
    }

    const likeDocument = await this.prismaService.like.findFirst({ where: { videoId: video.id } })

    /** This is video's first like */
    if (!likeDocument) {
      const [like] = await Promise.all([
        this.prismaService.like.create({
          data: {
            video: { connect: { id: video.id } },
            likedBy: { connect: { id: user.id } },
          },
        }),
        this.videoService.increaseLike(video.id),
      ])

      return like
    }

    const isLiked = likeDocument.likedByIds.includes(user.id)

    if (isLiked) {
      const [like] = await Promise.all([
        this.prismaService.like.update({
          where: { id: likeDocument.id },
          data: { likedBy: { disconnect: { id: user.id } } },
        }),
        this.videoService.decreaseLike(video.id),
      ])
      return like
    }

    const [like] = await Promise.all([
      this.prismaService.like.update({
        where: { id: likeDocument.id },
        data: { likedBy: { connect: { id: user.id } } },
      }),
      this.videoService.increaseLike(video.id),
    ])

    return like
  }
}
