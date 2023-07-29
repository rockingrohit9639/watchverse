import { IsMongoId, IsOptional, IsString } from 'class-validator'

export class UpdateProfileDto {
  @IsString()
  name: string

  @IsOptional()
  @IsMongoId()
  picture?: string
}
