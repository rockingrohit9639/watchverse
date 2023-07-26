import * as crypto from 'crypto'
import { ConfigService } from '@nestjs/config'
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface'
import { diskStorage } from 'multer'
import { BadRequestException } from '@nestjs/common'
import { EnvironmentVars } from './config.options'
import { VALID_IMAGE_TYPES, VALID_VIDEO_TYPES } from '~/utils/multer'
import { MimeType } from '~/file/file.type'

export function getFilename() {
  return crypto.randomBytes(16).toString('hex')
}

export function createMulterOptions(configService: ConfigService<EnvironmentVars>): MulterOptions {
  return {
    storage: diskStorage({
      filename: (_, __, cb) => {
        const filename = getFilename()
        cb(null, filename)
      },
      destination: configService.get('UPLOAD_DEST'),
    }),
    fileFilter: (_, file, cb) => {
      const validMimeTypes = [...VALID_IMAGE_TYPES, ...VALID_VIDEO_TYPES]
      if (validMimeTypes.includes(file.mimetype as MimeType) === false) {
        cb(new BadRequestException('Unsupported file format!'), false)
      }

      /** Checking file size for images */
      if (VALID_IMAGE_TYPES.includes(file.mimetype as MimeType)) {
        const fileSize = parseInt(configService.get('UPLOAD_IMAGE_MAX_SIZE'))
        if (file.size > fileSize) {
          cb(new BadRequestException('File size is too large!'), false)
        }
      }

      /** Checking file size for videos */
      if (VALID_VIDEO_TYPES.includes(file.mimetype as MimeType)) {
        const fileSize = parseInt(configService.get('UPLOAD_VIDEO_MAX_SIZE'))
        if (file.size > fileSize) {
          cb(new BadRequestException('File size is too large!'), false)
        }
      }

      cb(null, true)
    },
    dest: configService.get('UPLOAD_DEST'),
  }
}
