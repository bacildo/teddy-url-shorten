import {
  Controller,
  Post,
  Body,
  Param,
  Get,
  Put,
  Delete,
  Redirect,
  UseGuards,
  Req,
} from '@nestjs/common';
import { UrlService } from '../urls/urls.service';
import { AuthGuard } from '@nestjs/passport';
import { CreateUrlDto } from './dto/create-url.dto';
import { UpdateUrlDto } from './dto/update-url.dto';

@Controller('url')
export class UrlController {
  constructor(private readonly urlService: UrlService) {}

  @Post('shorten')
  async shortenUrl(
    @Body() createUrlDto: CreateUrlDto,
    @Req() req: any,
  ): Promise<{ shortUrl: string }> {
    const ownerId = req.user?.id;
    const shortUrl = await this.urlService.shortenUrl(
      createUrlDto.originalUrl,
      ownerId,
    );
    return { shortUrl };
  }

  @Get(':shortUrl')
  @Redirect()
  async redirectToOriginal(
    @Param('shortUrl') shortUrl: string,
  ): Promise<{ url: string }> {
    const originalUrl = await this.urlService.redirectToOriginal(shortUrl);
    return { url: originalUrl };
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getUrlsByUser(@Req() req: any) {
    return await this.urlService.getUrlsByUser(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':shortUrl')
  async updateOriginalUrl(
    @Param('shortUrl') shortUrl: string,
    @Body() updateUrlDto: UpdateUrlDto,
  ) {
    await this.urlService.updateOriginalUrl(shortUrl, updateUrlDto.originalUrl);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':shortUrl')
  async deleteUrl(@Param('shortUrl') shortUrl: string) {
    await this.urlService.deleteUrl(shortUrl);
  }
}
