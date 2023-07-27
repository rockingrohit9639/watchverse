import { PartialType } from '@nestjs/mapped-types'
import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePlaylistDto {
  @IsString()
  @MinLength(4)
  @MaxLength(250)
  title: string

  @IsOptional()
  @IsString()
  @MinLength(20)
  @MaxLength(500)
  description?: string
}

export class UpdatePlaylistDto extends PartialType(CreatePlaylistDto) {}
