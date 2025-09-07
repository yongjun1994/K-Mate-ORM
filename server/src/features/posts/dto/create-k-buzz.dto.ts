import { IsString, IsNotEmpty, MaxLength } from 'class-validator';

export class CreateKBuzzDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @IsString()
  @IsNotEmpty()
  content: string;
}
