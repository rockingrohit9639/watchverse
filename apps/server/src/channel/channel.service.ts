import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Channel } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { SanitizedUser } from '~/user/user.types'
import { USER_SELECT_FIELDS } from '~/user/user.fields'
import { FileService } from '~/file/file.service'

@Injectable()
export class ChannelService {
  constructor(private readonly prismaService: PrismaService, private readonly fileService: FileService) {}

  async createChannel(dto: CreateChannelDto, user: SanitizedUser): Promise<Channel> {
    const existingChannel = await this.prismaService.channel.findFirst({ where: { name: dto.name } })
    if (existingChannel) {
      throw new BadRequestException('Channel with this name already exists!')
    }

    const isLogoAnImage = await this.fileService.isFileAnImage(dto.logo)
    if (!isLogoAnImage) {
      throw new BadRequestException('Logo is not an image file!')
    }

    const isBannerAnImage = dto.banner ? await this.fileService.isFileAnImage(dto.banner) : true
    if (!isBannerAnImage) {
      throw new BadRequestException('Banner is not an image!')
    }

    const createdChannels = await this.prismaService.channel.count({ where: { createdById: user.id } })

    return this.prismaService.channel.create({
      data: {
        name: dto.name,
        description: dto.description,
        logo: { connect: { id: dto.logo } },
        isActive: createdChannels === 0, // Making the first created channel active
        banner: dto.banner ? { connect: { id: dto.banner } } : undefined,
        createdBy: { connect: { id: user.id } },
      },
    })
  }

  async updateChannel(id: string, dto: UpdateChannelDto, user: SanitizedUser): Promise<Channel> {
    const channel = await this.findOneById(id)
    if (channel.createdById !== user.id) {
      throw new UnauthorizedException('You are not allowed to update this channel!')
    }
    return this.prismaService.channel.update({
      where: { id },
      data: { name: dto.name, description: dto.description, isActive: dto.isActive },
    })
  }

  async findOneById(id: string): Promise<Channel> {
    const channel = await this.prismaService.channel.findFirst({
      where: { id },
      include: { createdBy: { select: USER_SELECT_FIELDS } },
    })
    if (!channel) {
      throw new NotFoundException('Channel not found!')
    }
    return channel
  }

  findUserChannels(user: SanitizedUser): Promise<Channel[]> {
    return this.prismaService.channel.findMany({ where: { createdById: user.id } })
  }

  async deleteChannel(id: string, user: SanitizedUser): Promise<Channel> {
    const channel = await this.findOneById(id)
    if (channel.createdById !== user.id) {
      throw new UnauthorizedException('You are not allowed to delete this channel!')
    }
    return this.prismaService.channel.delete({ where: { id } })
  }

  async findActiveChannel(userId: string): Promise<Channel> {
    return this.prismaService.channel.findFirst({ where: { isActive: true, createdById: userId } })
  }
}
