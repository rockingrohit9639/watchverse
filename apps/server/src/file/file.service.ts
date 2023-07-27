import * as path from 'path'
import * as fs from 'fs'
import { Injectable, NotFoundException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { File } from '@prisma/client'
import { Response } from 'express'
import * as contentDisposition from 'content-disposition'
import { EnvironmentVars } from '~/config/config.options'
import { PrismaService } from '~/prisma/prisma.service'
import { SanitizedUser } from '~/user/user.types'
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from '~/utils/multer'
import { MimeType } from './file.type'

@Injectable()
export class FileService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly configService: ConfigService<EnvironmentVars>,
  ) {}

  uploadFile(file: Express.Multer.File, user: SanitizedUser): Promise<File> {
    return this.prismaService.file.create({
      data: {
        originalName: file.originalname,
        encoding: file.encoding,
        mimeType: file.mimetype,
        filename: file.filename,
        size: file.size,
        uploadedBy: { connect: { id: user.id } },
      },
    })
  }

  async downloadFile(res: Response, fileId: string) {
    const file = await this.findOneById(fileId)
    const path = this.getFilePath(file)
    try {
      /** Verifying if the file exists on disk or not */
      await fs.promises.access(path)
    } catch (error) {
      throw new NotFoundException('File not found!')
    }
    res.setHeader('content-type', file.mimeType)
    res.setHeader('Content-Disposition', contentDisposition(file.filename, { type: 'inline' }))
    res.sendFile(path)
  }

  async findOneById(id: string): Promise<File> {
    const file = await this.prismaService.file.findFirst({ where: { id } })
    if (!file) {
      throw new NotFoundException('File not found')
    }
    return file
  }

  private getFilePath(file: File): string {
    return path.resolve(this.configService.get('UPLOAD_DEST'), file.filename)
  }

  async isFileAVideo(id: string): Promise<boolean> {
    const file = await this.findOneById(id)
    return VALID_VIDEO_TYPES.includes(file.mimeType as MimeType)
  }

  async isFileAnImage(id: string): Promise<boolean> {
    const file = await this.findOneById(id)
    return VALID_IMAGE_TYPES.includes(file.mimeType as MimeType)
  }
}
