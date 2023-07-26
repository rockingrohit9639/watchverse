import { MimeType } from '~/file/file.type'

export const MB = 1000 * 1024
export const IMAGE_MAX_FILE_SIZE = MB * 2 // 2 MB
export const VIDEO_MAX_FILE_SIZE = MB * 1024 // 1GB

export const VALID_IMAGE_TYPES: MimeType[] = ['image/png', 'image/jpeg', 'image/jpg']
export const VALID_VIDEO_TYPES: MimeType[] = ['video/mp4', 'video/3gpp', 'video/quicktime', 'video/x-msvideo']
