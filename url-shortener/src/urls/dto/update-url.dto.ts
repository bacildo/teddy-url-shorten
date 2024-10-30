import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateUrlDto {
  @IsString()
  @IsNotEmpty()
  originalUrl!: string;

  @IsString()
  @IsNotEmpty()
  shortUrl!: string;
}
