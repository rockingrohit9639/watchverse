import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Playlist } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlist.dto'
import { SanitizedUser } from '~/user/user.types'
import { ChannelService } from '~/channel/channel.service'
import { FileService } from '~/file/file.service'
import { PLAYLIST_INCLUDE } from './playlist.fields'
import { VIDEO_INCLUDE_FIELDS } from '~/video/video.fields'

@Injectable()
export class PlaylistService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly channelService: ChannelService,
    private readonly fileService: FileService,
  ) {}

  async createPlaylist(dto: CreatePlaylistDto, user: SanitizedUser): Promise<Playlist> {
    const isThumbnailAnImage = await this.fileService.isFileAnImage(dto.thumbnail)
    if (!isThumbnailAnImage) {
      throw new ConflictException('Thumbnail should be an image!')
    }

    const activeChannel = await this.channelService.findActiveChannel(user.id)
    return this.prismaService.playlist.create({
      data: {
        title: dto.title,
        visibility: dto.visibility,
        description: dto.description,
        createdBy: { connect: { id: user.id } },
        thumbnail: { connect: { id: dto.thumbnail } },
        channel: { connect: { id: activeChannel.id } },
      },
      include: PLAYLIST_INCLUDE,
    })
  }

  async findOneById(id: string): Promise<Playlist> {
    const playlist = await this.prismaService.playlist.findFirst({
      where: { id },
      include: { ...PLAYLIST_INCLUDE, videos: { include: VIDEO_INCLUDE_FIELDS } },
    })
    if (!playlist) {
      throw new NotFoundException('Playlist not found!')
    }
    return playlist
  }

  async updatePlaylist(id: string, dto: UpdatePlaylistDto, user: SanitizedUser): Promise<Playlist> {
    const playlist = await this.findOneById(id)
    if (playlist.createdById !== user.id) {
      throw new ForbiddenException('Playlist does not belong to you!')
    }
    return this.prismaService.playlist.update({
      where: { id },
      data: {
        title: dto.title,
        description: dto.description,
      },
    })
  }

  async findChannelPlaylists(channelId: string): Promise<Playlist[]> {
    const channel = await this.channelService.findOneById(channelId)
    return this.prismaService.playlist.findMany({ where: { channelId: channel.id }, include: PLAYLIST_INCLUDE })
  }

  async findActiveChannelPlaylist(user: SanitizedUser): Promise<Playlist[]> {
    const activeChannel = await this.channelService.findActiveChannel(user.id)
    return this.prismaService.playlist.findMany({ where: { channelId: activeChannel.id }, include: PLAYLIST_INCLUDE })
  }
}
