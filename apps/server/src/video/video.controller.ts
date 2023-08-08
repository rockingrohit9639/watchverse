import { Body, Controller, Delete, Get, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common'
import { Video } from '@prisma/client'
import { Request, Response } from 'express'
import { VideoService } from './video.service'
import { UpdateVideoDto, UploadVideoDto } from './video.dto'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'

@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Get('stream/:id')
  streamVideo(@Param('id') id: string, @Req() req: Request, @Res({ passthrough: true }) res: Response) {
    return this.videoService.streamVideo(id, req, res)
  }

  @UseGuards(JwtGuard)
  @Post()
  uploadVideo(@Body() dto: UploadVideoDto, @GetUser() user: SanitizedUser): Promise<Video> {
    return this.videoService.uploadVideo(dto, user)
  }

  @UseGuards(JwtGuard)
  @Patch(':id')
  updateVideo(@Param('id') id: string, @Body() dto: UpdateVideoDto, @GetUser() user: SanitizedUser): Promise<Video> {
    return this.videoService.updateVideo(id, dto, user)
  }

  @UseGuards(JwtGuard)
  @Get('channel/:id')
  findAllChannelVideos(@Param('id') channelId: string): Promise<Video[]> {
    return this.videoService.findAllChannelVideos(channelId)
  }

  @UseGuards(JwtGuard)
  @Get()
  findUserVideos(@GetUser() user: SanitizedUser): Promise<Video[]> {
    return this.videoService.findUserVideos(user)
  }

  @UseGuards(JwtGuard)
  @Delete(':id')
  delete(@Param('id') id: string, @GetUser() user: SanitizedUser): Promise<Video> {
    return this.videoService.delete(id, user)
  }

  @UseGuards(JwtGuard)
  @Post('add-to-playlist/:videoId/:playlistId')
  addToPlaylist(
    @Param('videoId') videoId: string,
    @Param('playlistId') playlistId: string,
    @GetUser() user: SanitizedUser,
  ): Promise<Video> {
    return this.videoService.addToPlaylist(videoId, playlistId, user)
  }

  @UseGuards(JwtGuard)
  @Get('playlist/:playlistId')
  findPlaylistVideos(@Param('playlistId') playlistId: string): Promise<Video[]> {
    return this.videoService.findPlaylistVideos(playlistId)
  }

  @UseGuards(JwtGuard)
  @Get('feed')
  getUserFeedVideos(@GetUser() user: SanitizedUser): Promise<Video[]> {
    return this.videoService.getUserFeedVideos(user)
  }

  @UseGuards(JwtGuard)
  @Get('suggestions/:id')
  findSuggestedVideos(@Param('id') id: string, @GetUser() user: SanitizedUser): Promise<Video[]> {
    return this.videoService.findSuggestedVideos(id, user)
  }

  @UseGuards(JwtGuard)
  @Get('active')
  findActiveChannelVideos(@GetUser() user: SanitizedUser): Promise<Video[]> {
    return this.videoService.findActiveChannelVideos(user)
  }

  @UseGuards(JwtGuard)
  @Get(':id')
  findOneById(@Param('id') id: string): Promise<Video> {
    return this.videoService.findOneById(id)
  }
}
