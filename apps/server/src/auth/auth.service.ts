import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt'
import { omit } from 'lodash'
import { Request, Response } from 'express'
import { ConfigService } from '@nestjs/config'
import { LoginDto, SignupDto } from './auth.dto'
import { UserService } from '~/user/user.service'
import { JwtPayload } from './auth.types'
import { SanitizedUser } from '~/user/user.types'
import { NotificationService } from '~/notification/notification.service'
import { EnvironmentVars } from '~/config/config.options'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly notificationService: NotificationService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  async login(dto: LoginDto): Promise<{ user: SanitizedUser; accessToken: string }> {
    const user = await this.userService.findOneByEmail(dto.email)
    if (!user) {
      throw new UnauthorizedException('Invalid Credentials!')
    }

    const isPasswordValid = bcrypt.compareSync(dto.password, user.password)
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Credentials')
    }

    const payload = { id: user.id, email: user.email } satisfies JwtPayload
    return {
      user: omit(user, 'password'),
      accessToken: await this.jwtService.signAsync(payload),
    }
  }

  async signup(dto: SignupDto): Promise<{ user: SanitizedUser; accessToken: string }> {
    const existingUser = await this.userService.findOneByEmail(dto.email)
    if (existingUser) {
      throw new BadRequestException('User already exists!')
    }

    const hashedPassword = bcrypt.hashSync(dto.password, 10)
    const user = await this.userService.createUser({ ...dto, password: hashedPassword })
    /** subscribing notifications channel */
    await this.notificationService.createSubscriber(user)

    const payload = { id: user.id, email: user.email } satisfies JwtPayload
    return {
      user,
      accessToken: await this.jwtService.signAsync(payload),
    }
  }

  async validatePayload(payload: JwtPayload): Promise<SanitizedUser> {
    const user = await this.userService.findOneById(payload.id)
    if (!user) {
      throw new NotFoundException('User not found')
    }
    return omit(user, 'password')
  }

  async loginWithOneSignCallback(request: Request, response: Response) {
    const user = request.user as SanitizedUser
    const payload = { id: user.id, email: user.email } satisfies JwtPayload
    const accessToken = await this.jwtService.signAsync(payload)
    return response.redirect(`${this.configService.get('ONESIGN_CLIENT_URL')}?accessToken=${accessToken}`)
  }
}
