import { Injectable } from '@nestjs/common'
import { View } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { SanitizedUser } from '~/user/user.types'
import { VideoService } from '~/video/video.service'

@Injectable()
export class ViewService {
  constructor(private readonly prismaService: PrismaService, private readonly videoService: VideoService) {}

  async updateViewCount(videoId: string, user: SanitizedUser): Promise<View> {
    const video = await this.videoService.findOneById(videoId)
    const viewDocument = await this.prismaService.view.findFirst({ where: { videoId: video.id } })

    /** This is first view on video */
    if (!viewDocument) {
      const [view] = await Promise.all([
        this.prismaService.view.create({
          data: { video: { connect: { id: video.id } }, viewedBy: { connect: { id: user.id } } },
        }),
        this.videoService.increaseView(video.id),
      ])
      return view
    }

    const isAlreadyViewedByUser = viewDocument.viewedByIds.includes(user.id)
    if (isAlreadyViewedByUser) {
      return viewDocument
    }

    const [view] = await Promise.all([
      this.prismaService.view.update({
        where: { id: viewDocument.id },
        data: { viewedBy: { connect: { id: user.id } } },
      }),
      this.videoService.increaseView(video.id),
    ])
    return view
  }
}
