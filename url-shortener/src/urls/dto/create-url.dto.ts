import { IsString, IsNotEmpty } from 'class-validator';

export class CreateUrlDto {
  @IsString()
  @IsNotEmpty()
  originalUrl!: string;

  @IsString()
  @IsNotEmpty()
  shortUrl!: string;
}
