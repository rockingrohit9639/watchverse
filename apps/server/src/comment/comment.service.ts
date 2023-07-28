import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Comment } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { VideoService } from '~/video/video.service'
import { CreateCommentDto, UpdateCommentDto } from './comment.dto'
import { SanitizedUser } from '~/user/user.types'

@Injectable()
export class CommentService {
  constructor(private readonly prismaService: PrismaService, private readonly videoService: VideoService) {}

  async createComment(videoId: string, dto: CreateCommentDto, user: SanitizedUser): Promise<Comment> {
    const video = await this.videoService.findOneById(videoId)
    return this.prismaService.comment.create({
      data: {
        content: dto.content,
        video: { connect: { id: video.id } },
        createdBy: { connect: { id: user.id } },
      },
    })
  }

  async findOneById(id: string): Promise<Comment> {
    const comment = await this.prismaService.comment.findFirst({ where: { id } })
    if (!comment) {
      throw new NotFoundException('Comment not found')
    }
    return comment
  }

  async updateComment(id: string, dto: UpdateCommentDto, user: SanitizedUser): Promise<Comment> {
    const comment = await this.findOneById(id)
    if (comment.createdById !== user.id) {
      throw new ForbiddenException('You are not allowed to update this comment!')
    }
    return this.prismaService.comment.update({ where: { id }, data: { content: dto.content } })
  }

  async deleteComment(id: string, user: SanitizedUser): Promise<Comment> {
    const comment = await this.findOneById(id)
    if (comment.createdById !== user.id) {
      throw new ForbiddenException('You are not allowed to delete this comment!')
    }
    return this.prismaService.comment.delete({ where: { id: comment.id } })
  }

  async findCommentForVideo(id: string): Promise<Comment[]> {
    const video = await this.videoService.findOneById(id)
    return this.prismaService.comment.findMany({ where: { videoId: video.id } })
  }
}
