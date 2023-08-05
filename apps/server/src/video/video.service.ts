import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Video } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { UpdateVideoDto, UploadVideoDto } from './video.dto'
import { SanitizedUser } from '~/user/user.types'
import { FileService } from '~/file/file.service'
import { ChannelService } from '~/channel/channel.service'
import { PlaylistService } from '~/playlist/playlist.service'
import { NotificationService } from '~/notification/notification.service'
import { VIDEO_INCLUDE_FIELDS } from './video.fields'

@Injectable()
export class VideoService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly channelService: ChannelService,
    private readonly playlistService: PlaylistService,
    private readonly notificationService: NotificationService,
  ) {}

  async uploadVideo(dto: UploadVideoDto, user: SanitizedUser): Promise<Video> {
    const isVideo = await this.fileService.isFileAVideo(dto.video)
    if (!isVideo) {
      throw new BadRequestException('File uploaded is not a video!')
    }

    const activeChannel = await this.channelService.findActiveChannel(user.id)
    const channelKey = this.channelService.getChannelKey(activeChannel.name, activeChannel.id)
    const videoUploaded = await this.prismaService.video.create({
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

    /** Sending notification to channel subscribers */
    this.notificationService.sendTopicNotifications(
      channelKey,
      `${user.name} uploaded a new video.\n${videoUploaded.title}`,
    )

    return videoUploaded
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
        thumbnail: dto.thumbnail ? { connect: { id: dto.thumbnail } } : undefined,
        visibility: dto.visibility,
      },
      include: VIDEO_INCLUDE_FIELDS,
    })
  }

  findUserVideos(user: SanitizedUser): Promise<Video[]> {
    return this.prismaService.video.findMany({ where: { uploadedById: user.id } })
  }

  async findAllChannelVideos(channelId: string): Promise<Video[]> {
    const channel = await this.channelService.findOneById(channelId)
    return this.prismaService.video.findMany({ where: { channelId: channel.id }, include: VIDEO_INCLUDE_FIELDS })
  }

  async delete(id: string, user: SanitizedUser): Promise<Video> {
    const video = await this.findOneById(id)
    if (video.uploadedById !== user.id) {
      throw new ForbiddenException('You are not the uploader of this video!')
    }

    return this.prismaService.video.delete({ where: { id } })
  }

  async addToPlaylist(videoId: string, playlistId: string, user: SanitizedUser): Promise<Video> {
    const playlist = await this.playlistService.findOneById(playlistId)
    if (playlist.createdById !== user.id) {
      throw new ForbiddenException('You are not allowed to add videos to this playlist!')
    }
    const video = await this.findOneById(videoId)
    const activeChannel = await this.channelService.findActiveChannel(user.id)

    if (video.channelId !== activeChannel.id) {
      throw new ForbiddenException('You are not allowed to add videos from other channels!')
    }

    return this.prismaService.video.update({
      where: { id: video.id },
      data: { playlists: { connect: { id: playlist.id } } },
    })
  }

  async findPlaylistVideos(playlistId: string): Promise<Video[]> {
    const playlist = await this.playlistService.findOneById(playlistId)
    return this.prismaService.video.findMany({ where: { playlists: { some: { id: playlist.id } } } })
  }

  async findActiveChannelVideos(user: SanitizedUser): Promise<Video[]> {
    const activeChannel = await this.channelService.findActiveChannel(user.id)
    return this.prismaService.video.findMany({ where: { channelId: activeChannel.id }, include: VIDEO_INCLUDE_FIELDS })
  }

  findAll(): Promise<Video[]> {
    return this.prismaService.video.findMany({ include: VIDEO_INCLUDE_FIELDS })
  }

  increaseLike(id: string): Promise<Video> {
    return this.prismaService.video.update({ where: { id }, data: { likes: { increment: 1 } } })
  }

  decreaseLike(id: string): Promise<Video> {
    return this.prismaService.video.update({ where: { id }, data: { likes: { decrement: 1 } } })
  }

  increaseView(id: string): Promise<Video> {
    return this.prismaService.video.update({ where: { id }, data: { views: { increment: 1 } } })
  }
}
