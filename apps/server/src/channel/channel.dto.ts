import { IsBoolean, IsMongoId, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'
import { PartialType, PickType } from '@nestjs/mapped-types'

export class CreateChannelDto {
  @IsString()
  @MinLength(4)
  @MaxLength(50)
  name: string

  @IsString()
  @MinLength(20)
  @MaxLength(2000)
  description: string

  @IsMongoId()
  logo: string

  @IsOptional()
  @IsMongoId()
  banner?: string
}

export class UpdateChannelDto extends PartialType(PickType(CreateChannelDto, ['name', 'description'])) {
  @IsOptional()
  @IsBoolean()
  isActive: boolean
}
