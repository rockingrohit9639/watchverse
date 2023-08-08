import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common'
import { Tag } from '@prisma/client'
import { TagService } from './tag.service'
import { CreateTagDto } from './tag.dto'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('tags')
export class TagController {
  constructor(private readonly tagService: TagService) {}

  @Post()
  createTag(@Body() dto: CreateTagDto): Promise<Tag> {
    return this.tagService.createTag(dto)
  }

  @Get()
  findAll(): Promise<Tag[]> {
    return this.tagService.findAll()
  }
}
