import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UrlService } from '../urls/urls.service';
import { UrlController } from '../urls/urls.controller';
import { Url } from '../urls/url.entity';
import { Click } from './click.entity';
import { LoggerModule } from 'src/utils/logger.module';

@Module({
  imports: [TypeOrmModule.forFeature([Url, Click]), LoggerModule],
  providers: [UrlService],
  controllers: [UrlController],
})
export class UrlsModule {}
