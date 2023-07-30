import { PartialType } from '@nestjs/mapped-types'
import { Visibility } from '@prisma/client'
import { IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  title: string

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(1000)
  description?: string

  @IsEnum(Visibility)
  visibility: Visibility
}

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {}
