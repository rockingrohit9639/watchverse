import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Channel } from '@prisma/client'
import { ChannelService } from './channel.service'
import { CreateChannelDto, UpdateChannelDto } from './channel.dto'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('channel')
export class ChannelController {
  constructor(private readonly channelService: ChannelService) {}

  @Post()
  createChannel(@Body() dto: CreateChannelDto, @GetUser() user: SanitizedUser): Promise<Channel> {
    return this.channelService.createChannel(dto, user)
  }

  @Patch(':id')
  updateChannel(@Param('id') id: string, @Body() dto: UpdateChannelDto, @GetUser() user: SanitizedUser) {
    return this.channelService.updateChannel(id, dto, user)
  }

  @Get()
  getUserChannels(@GetUser() user: SanitizedUser): Promise<Channel[]> {
    return this.channelService.findUserChannels(user)
  }

  @Delete(':id')
  deleteChannel(@Param('id') id: string, @GetUser() user: SanitizedUser): Promise<Channel> {
    return this.channelService.deleteChannel(id, user)
  }

  @Post('subscribe/:id')
  subscribeChannel(@Param('id') id: string, @GetUser() user: SanitizedUser): Promise<Channel> {
    return this.channelService.subscribeChannel(id, user)
  }

  @Get('subscribers/:id')
  findSubscribers(
    @Param('id') id: string,
    @GetUser() user: SanitizedUser,
  ): Promise<
    {
      id: string
      name: string
      email: string
    }[]
  > {
    return this.channelService.findSubscribers(id, user)
  }

  @Get(':id')
  findChannel(@Param('id') id: string): Promise<Channel> {
    return this.channelService.findOneById(id)
  }
}
