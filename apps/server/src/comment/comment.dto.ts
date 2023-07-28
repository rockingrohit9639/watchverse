import { IsString, MaxLength, MinLength } from 'class-validator'

export class CreateCommentDto {
  @IsString()
  @MinLength(5)
  @MaxLength(1000)
  content: string
}

export class UpdateCommentDto extends CreateCommentDto {}
