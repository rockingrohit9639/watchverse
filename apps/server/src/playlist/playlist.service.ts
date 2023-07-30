import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { Playlist } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreatePlaylistDto, UpdatePlaylistDto } from './playlist.dto'
import { SanitizedUser } from '~/user/user.types'
import { ChannelService } from '~/channel/channel.service'

@Injectable()
export class PlaylistService {
  constructor(private readonly prismaService: PrismaService, private readonly channelService: ChannelService) {}

  async createPlaylist(dto: CreatePlaylistDto, user: SanitizedUser): Promise<Playlist> {
    const activeChannel = await this.channelService.findActiveChannel(user.id)
    return this.prismaService.playlist.create({
      data: {
        title: dto.title,
        description: dto.description,
        createdBy: { connect: { id: user.id } },
        channel: { connect: { id: activeChannel.id } },
        visibility: dto.visibility,
      },
    })
  }

  async findOneById(id: string): Promise<Playlist> {
    const playlist = await this.prismaService.playlist.findFirst({ where: { id } })
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
    return this.prismaService.playlist.findMany({ where: { channelId: channel.id } })
  }
}
