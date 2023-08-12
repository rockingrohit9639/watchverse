import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { ACCOUNT_PROVIDERS } from '~/config/constants'

@Injectable()
export class OneSignAuthGuard extends AuthGuard(ACCOUNT_PROVIDERS.ONE_SIGN) {
  constructor() {
    super()
  }

  handleRequest(error: any, user: any) {
    if (error || !user) {
      throw new HttpException(error.message, error.status ?? HttpStatus.INTERNAL_SERVER_ERROR)
    }

    return user
  }
}
