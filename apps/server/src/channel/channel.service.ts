import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { Channel } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { SanitizedUser } from '~/user/user.types'
import { USER_SELECT_FIELDS } from '~/user/user.fields'
import { FileService } from '~/file/file.service'
import { NotificationService } from '~/notification/notification.service'
import { slugify } from '~/utils/slugify'

@Injectable()
export class ChannelService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly fileService: FileService,
    private readonly notificationService: NotificationService,
  ) {}

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
    const channelCreated = await this.prismaService.channel.create({
      data: {
        name: dto.name,
        description: dto.description,
        logo: { connect: { id: dto.logo } },
        isActive: createdChannels === 0, // Making the first created channel active
        banner: dto.banner ? { connect: { id: dto.banner } } : undefined,
        createdBy: { connect: { id: user.id } },
      },
    })

    /** Each time a channel is created, a topic is created for the channel so that all its subscribers can receive notifications   */
    await this.notificationService.createTopic(
      this.getChannelKey(channelCreated.name, channelCreated.id),
      channelCreated.name,
    )

    return channelCreated
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
    const activeChannel = await this.prismaService.channel.findFirst({ where: { isActive: true, createdById: userId } })
    if (!activeChannel) {
      throw new NotFoundException('No active channel found, please create a channel first!')
    }
    return activeChannel
  }

  async subscribeChannel(id: string, user: SanitizedUser): Promise<Channel> {
    const channel = await this.findOneById(id)
    if (channel.createdById === user.id) {
      throw new BadRequestException('You cannot subscribe to your own channel!')
    }

    const isSubscribed = await this.prismaService.channel.findFirst({ where: { subscriberIds: { has: user.id } } })
    if (isSubscribed) {
      /** Remove subscriber to receive notifications */
      await this.notificationService.removeSubscriber(this.getChannelKey(channel.name, channel.id), user.id)
      return this.prismaService.channel.update({
        where: { id: channel.id },
        data: { subscribers: { disconnect: { id: user.id } } },
      })
    }

    /** Add subscriber to receive notifications  */
    await this.notificationService.addSubscriber(this.getChannelKey(channel.name, channel.id), user.id)
    return this.prismaService.channel.update({
      where: { id: channel.id },
      data: { subscribers: { connect: { id: user.id } } },
    })
  }

  async findSubscribers(
    id: string,
    user: SanitizedUser,
  ): Promise<
    {
      id: string
      name: string
      email: string
    }[]
  > {
    const channel = await this.prismaService.channel.findFirst({
      where: { id },
      include: { subscribers: { select: { id: true, name: true, email: true } } },
    })
    if (!channel) {
      throw new NotFoundException('Channel not found!')
    }

    if (channel.createdById !== user.id) {
      throw new ForbiddenException('You are not allowed to see subscribers for this channel!')
    }

    return channel.subscribers
  }

  /** Key format -> channel-name-channel-id  */
  getChannelKey(name: string, id: string): string {
    return slugify(`${name}-${id}`)
  }
}
