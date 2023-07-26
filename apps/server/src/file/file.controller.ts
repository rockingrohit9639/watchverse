import { Controller, Get, Param, Post, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common'
import { FileInterceptor } from '@nestjs/platform-express'
import { Response } from 'express'
import { File } from '@prisma/client'
import { FileService } from './file.service'
import { JwtGuard } from '~/auth/jwt/jwt.guard'
import { GetUser } from '~/auth/user.decorator'
import { SanitizedUser } from '~/user/user.types'

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @UseGuards(JwtGuard)
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  uploadFile(@UploadedFile() file: Express.Multer.File, @GetUser() user: SanitizedUser): Promise<File> {
    return this.fileService.uploadFile(file, user)
  }

  @Get('/download/:fileId')
  getFile(@Res() response: Response, @Param('fileId') fileId: string) {
    return this.fileService.downloadFile(response, fileId)
  }
}
