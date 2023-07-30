import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Video } from '@prisma/client'
import { VideoService } from './video.service'
import { UpdateVideoDto, UploadVideoDto } from './video.dto'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'

@UseGuards(JwtGuard)
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post()
  uploadVideo(@Body() dto: UploadVideoDto, @GetUser() user: SanitizedUser): Promise<Video> {
    return this.videoService.uploadVideo(dto, user)
  }

  @Patch(':id')
  updateVideo(@Param('id') id: string, @Body() dto: UpdateVideoDto, @GetUser() user: SanitizedUser): Promise<Video> {
    return this.videoService.updateVideo(id, dto, user)
  }

  @Get('channel/:id')
  findAllChannelVideos(@Param('id') channelId: string): Promise<Video[]> {
    return this.videoService.findAllChannelVideos(channelId)
  }

  @Get()
  findUserVideos(@GetUser() user: SanitizedUser): Promise<Video[]> {
    return this.videoService.findUserVideos(user)
  }

  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: SanitizedUser): Promise<Video> {
    return this.videoService.delete(id, user)
  }

  @Post('add-to-playlist/:videoId/:playlistId')
  addToPlaylist(
    @Param('videoId') videoId: string,
    @Param('playlistId') playlistId: string,
    @GetUser() user: SanitizedUser,
  ): Promise<Video> {
    return this.videoService.addToPlaylist(videoId, playlistId, user)
  }

  @Get('playlist/:playlistId')
  findPlaylistVideos(@Param('playlistId') playlistId: string): Promise<Video[]> {
    return this.videoService.findPlaylistVideos(playlistId)
  }

  @Get('feed')
  findAll(): Promise<Video[]> {
    return this.videoService.findAll()
  }

  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Video> {
    return this.videoService.findOneById(id)
  }
}
