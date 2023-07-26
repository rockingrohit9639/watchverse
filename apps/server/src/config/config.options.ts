import { ConfigModuleOptions } from '@nestjs/config'
import * as joi from 'types-joi'
import { IMAGE_MAX_FILE_SIZE, VIDEO_MAX_FILE_SIZE } from '~/utils/multer'

const validationSchema = joi.object({
  PORT: joi.number().integer().min(1000).max(9999).required(),
  DATABASE_URL: joi.string().required(),
  JWT_SECRET: joi.string().required(),
  JWT_EXPIRATION: joi.string().required(),
  UPLOAD_DEST: joi.string().required(),
  UPLOAD_IMAGE_MAX_SIZE: joi.number().default(IMAGE_MAX_FILE_SIZE),
  UPLOAD_VIDEO_MAX_SIZE: joi.number().default(VIDEO_MAX_FILE_SIZE),
})

export type EnvironmentVars = joi.InterfaceFrom<typeof validationSchema>

export const configOptions: ConfigModuleOptions = {
  envFilePath: ['.env'],
  isGlobal: true,
  validationSchema,
}
