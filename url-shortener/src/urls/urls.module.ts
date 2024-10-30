import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from '../urls/urls.service';
import { UrlController } from '../urls/urls.controller';
import { Url } from '../urls/url.entity';
import { Click } from './click.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click])],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlsModule {}
