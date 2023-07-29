import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common'
import { User } from '@prisma/client'
import { SignupDto } from '~/auth/auth.dto'
import { PrismaService } from '~/prisma/prisma.service'
import { USER_SELECT_FIELDS } from './user.fields'
import { SanitizedUser } from './user.types'
import { UpdateProfileDto } from './user.dto'
import { FileService } from '~/file/file.service'

@Injectable()
export class UserService {
  constructor(private readonly prismaService: PrismaService, private readonly fileService: FileService) {}

  createUser(dto: SignupDto): Promise<SanitizedUser> {
    return this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: dto.password,
      },
      select: USER_SELECT_FIELDS,
    })
  }

  findOneById(id: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { id } })
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.prismaService.user.findFirst({ where: { email } })
  }

  async updateProfile(id: string, dto: UpdateProfileDto, user: SanitizedUser): Promise<SanitizedUser> {
    const existingUser = await this.findOneById(id)
    if (!existingUser) {
      throw new NotFoundException('User not found!')
    }

    if (existingUser.id !== user.id) {
      throw new ForbiddenException('You are not allowed to update this profile!')
    }

    if (dto.picture && !this.fileService.isFileAnImage(dto.picture)) {
      throw new ConflictException('Only images are allowed for profile picture!')
    }

    return this.prismaService.user.update({
      where: { id: user.id },
      data: { name: dto.name, picture: dto.picture ? { connect: { id: dto.picture } } : undefined },
      select: USER_SELECT_FIELDS,
    })
  }
}
