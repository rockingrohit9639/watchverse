import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Video } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { UpdateVideoDto, UploadVideoDto } from './video.dto'
import { SanitizedUser } from '~/user/user.types'
import { FileService } from '~/file/file.service'
import { ChannelService } from '~/channel/channel.service'

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly channelService: ChannelService,
  ) {}

  async uploadVideo(dto: UploadVideoDto, user: SanitizedUser): Promise<Video> {
    const isVideo = await this.fileService.isFileAVideo(dto.video)
    if (!isVideo) {
      throw new BadRequestException('File uploaded is not a video!')
    }

    const activeChannel = await this.channelService.findActiveChannel(user.id)
    if (!activeChannel) {
      throw new BadRequestException('No active channel found!')
    }

    return this.prismaService.video.create({
      data: {
        title: dto.title,
        description: dto.description,
        uploadedBy: { connect: { id: user.id } },
        channel: { connect: { id: activeChannel.id } },
        visibility: dto.visibility,
        video: { connect: { id: dto.video } },
        thumbnail: { connect: { id: dto.thumbnail } },
      },
    })
  }

  async findOneById(id: string): Promise<Video> {
    const video = await this.prismaService.video.findFirst({ where: { id } })
    if (!video) {
      throw new NotFoundException('Video not found!')
    }
    return video
  }

  async updateVideo(id: string, dto: UpdateVideoDto, user: SanitizedUser): Promise<Video> {
    const video = await this.findOneById(id)
    if (video.uploadedById !== user.id) {
      throw new ForbiddenException('You are not the uploader of this video!')
    }

    return this.prismaService.video.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
    })
  }

  findAll(user: SanitizedUser): Promise<Video[]> {
    return this.prismaService.video.findMany({ where: { uploadedById: user.id } })
  }

  async findAllChannelVideos(channelId: string): Promise<Video[]> {
    const channel = await this.channelService.findOneById(channelId)
    return this.prismaService.video.findMany({ where: { channelId: channel.id } })
  }

  async delete(id: string, user: SanitizedUser): Promise<Video> {
    const video = await this.findOneById(id)
    if (video.uploadedById !== user.id) {
      throw new ForbiddenException('You are not the uploader of this video!')
    }

    return this.prismaService.video.delete({ where: { id } })
  }
}
