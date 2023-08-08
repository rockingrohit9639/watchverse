import { Injectable } from '@nestjs/common'
import { Tag } from '@prisma/client'
import { PrismaService } from '~/prisma/prisma.service'
import { CreateTagDto } from './tag.dto'

@Injectable()
export class TagService {
  constructor(private readonly prismaService: PrismaService) {}

  createTag(dto: CreateTagDto): Promise<Tag> {
    return this.prismaService.tag.create({ data: { tag: dto.tag } })
  }

  findAll(): Promise<Tag[]> {
    return this.prismaService.tag.findMany()
  }
}
