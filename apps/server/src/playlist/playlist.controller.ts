import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Playlist } from '@prisma/client'
import { PlaylistService } from './playlist.service'
import { CreatePlaylistDto } from './playlist.dto'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { UpdateChannelDto } from '~/channel/channel.dto'

@UseGuards(JwtGuard)
@Controller('playlist')
export class PlaylistController {
  constructor(private readonly playlistService: PlaylistService) {}

  @Post()
  createPlaylist(@Body() dto: CreatePlaylistDto, @GetUser() user: SanitizedUser): Promise<Playlist> {
    return this.playlistService.createPlaylist(dto, user)
  }

  @Patch(':id')
  updateChannel(
    @Param('id') id: string,
    @Body() dto: UpdateChannelDto,
    @GetUser() user: SanitizedUser,
  ): Promise<Playlist> {
    return this.playlistService.updatePlaylist(id, dto, user)
  }

  @Get('channel/:id')
  findChannelPlaylists(@Param('id') channelId: string): Promise<Playlist[]> {
    return this.playlistService.findChannelPlaylists(channelId)
  }

  @Get()
  findActiveChannelPlaylist(@GetUser() user: SanitizedUser): Promise<Playlist[]> {
    return this.playlistService.findActiveChannelPlaylist(user)
  }
}
