import { PartialType, PickType } from '@nestjs/mapped-types'
import { VideoVisibility } from '@prisma/client'
import { IsEnum, IsMongoId, IsString, MaxLength, MinLength } from 'class-validator'

export class UploadVideoDto {
  @IsString()
  @MinLength(10)
  @MaxLength(250)
  title: string

  @IsString()
  @MinLength(30)
  @MaxLength(2000)
  description: string

  @IsEnum(VideoVisibility)
  visibility: VideoVisibility

  @IsMongoId()
  video: string

  @IsMongoId()
  thumbnail: string
}

export class UpdateVideoDto extends PartialType(PickType(UploadVideoDto, ['title', 'description'])) {}
