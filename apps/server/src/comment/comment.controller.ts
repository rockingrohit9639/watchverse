import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common'
import { Comment } from '@prisma/client'
import { CommentService } from './comment.service'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'
import { CreateCommentDto, UpdateCommentDto } from './comment.dto'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':videoId')
  createComment(
    @Param('videoId') videoId: string,
    @Body() dto: CreateCommentDto,
    @GetUser() user: SanitizedUser,
  ): Promise<Comment> {
    return this.commentService.createComment(videoId, dto, user)
  }

  @Patch(':id')
  updateComment(
    @Param('id') id: string,
    @Body() dto: UpdateCommentDto,
    @GetUser() user: SanitizedUser,
  ): Promise<Comment> {
    return this.commentService.updateComment(id, dto, user)
  }

  @Delete(':id')
  deleteComment(@Param('id') id: string, @GetUser() user: SanitizedUser): Promise<Comment> {
    return this.commentService.deleteComment(id, user)
  }

  @Get(':videoId')
  findCommentForVideo(@Param('videoId') videoId: string): Promise<Comment[]> {
    return this.commentService.findCommentForVideo(videoId)
  }
}
