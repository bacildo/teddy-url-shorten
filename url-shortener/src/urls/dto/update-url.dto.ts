import { ApiProperty } from '@nestjs/swagger';

export class UpdateUrlDto {
  @ApiProperty({
    description: 'original url',
    example:
      'https://teddy360.com.br/material/marco-legal-das-garantias-sancionado-entenda-o-que-muda/',
  })
  originalUrl: string;

  @ApiProperty({
    description: 'short url',
    example: 'https://localhost:3000/url/fzE345w',
  })
  shortUrl: string;
}
