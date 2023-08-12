import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, VerifyCallback } from 'passport-oauth2'
import axios from 'axios'
import z, { ZodError } from 'zod'
import { AccountProvider } from '@prisma/client'
import * as dayjs from 'dayjs'
import { EnvironmentVars } from '~/config/config.options'
import { ACCOUNT_PROVIDERS } from '~/config/constants'
import { PrismaService } from '~/prisma/prisma.service'
import { SanitizedUser } from '~/user/user.types'
import { USER_SELECT_FIELDS } from '~/user/user.fields'

const userProfileSchema = z.object({
  userId: z.string(),
  name: z.string(),
  email: z.string().email(),
  exp: z.number(),
})

type UserProfile = z.infer<typeof userProfileSchema>

@Injectable()
export class OneSignStrategy extends PassportStrategy(Strategy, ACCOUNT_PROVIDERS.ONE_SIGN) {
  constructor(
    private readonly configService: ConfigService<EnvironmentVars>,
    private readonly prismaService: PrismaService,
  ) {
    super({
      clientID: configService.get('ONESIGN_CLIENT_ID'),
      clientSecret: configService.get('ONESIGN_CLIENT_SECRET'),
      authorizationURL: configService.get('ONESIGN_AUTH_URL'),
      tokenURL: `${configService.get('ONESIGN_SERVER_URL')}/access-token`,
      callbackURL: configService.get('ONESIGN_CALLBACK_URL'),
    })
  }

  async validate(accessToken: string, refreshToken: string, profile: UserProfile, done: VerifyCallback) {
    try {
      const user = await this.findOrCreateUser(profile)
      await this.findOrCreateAccount(accessToken, user, profile)
      return done(null, user)
    } catch (error) {
      return done(new Error('Something went wrong while validating!'), null)
    }
  }

  async userProfile(accessToken: string, done: VerifyCallback) {
    try {
      const { data } = await axios.get(`${this.configService.get('ONESIGN_SERVER_URL')}/user`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })

      const validated = userProfileSchema.parse(data)
      return done(null, validated)
    } catch (error) {
      if (error instanceof ZodError) {
        return done(new Error('Got invalid data from One Sign'), null)
      }
      return done(new Error('Something went wrong'), null)
    }
  }

  async findOrCreateUser(profile: UserProfile) {
    const account = await this.prismaService.account.findFirst({
      where: { provider: AccountProvider.ONE_SIGN, providerId: profile.userId },
    })

    if (account) {
      return this.prismaService.user.update({
        where: { id: account.userId },
        data: { name: profile.name },
        select: USER_SELECT_FIELDS,
      })
    }

    return this.prismaService.user.create({
      data: {
        name: profile.name,
        email: profile.email,
      },
      select: USER_SELECT_FIELDS,
    })
  }

  async findOrCreateAccount(accessToken: string, user: SanitizedUser, profile: UserProfile) {
    const expiry = dayjs.unix(profile.exp)
    const account = await this.prismaService.account.findFirst({
      where: { provider: AccountProvider.ONE_SIGN, providerId: profile.userId },
    })

    if (account) {
      return this.prismaService.account.update({
        where: { id: account.id },
        data: {
          accessToken,
          expiresAt: expiry.toDate(),
          user: { connect: { id: user.id } },
        },
      })
    }

    return this.prismaService.account.create({
      data: {
        provider: AccountProvider.ONE_SIGN,
        providerId: profile.userId,
        accessToken,
        expiresAt: expiry.toDate(),
        user: { connect: { id: user.id } },
      },
    })
  }
}
