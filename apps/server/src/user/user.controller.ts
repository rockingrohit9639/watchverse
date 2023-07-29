import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common'
import { UserService } from './user.service'
import { UpdateProfileDto } from './user.dto'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from './user.types'
import { JwtGuard } from '~/auth/jwt/jwt.guard'

@UseGuards(JwtGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Patch(':id')
  updateProfile(
    @Param('id') id: string,
    @Body() dto: UpdateProfileDto,
    @GetUser() user: SanitizedUser,
  ): Promise<SanitizedUser> {
    return this.userService.updateProfile(id, dto, user)
  }
}
