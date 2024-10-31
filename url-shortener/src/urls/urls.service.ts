import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Url } from './url.entity';
import { Click } from './click.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(Url) private urlRepository: Repository<Url>,
    @InjectRepository(Click) private clickRepository: Repository<Click>,
  ) {}

  async shortenUrl(originalUrl: string, ownerId?: number): Promise<string> {
    const shortUrl = uuidv4().substring(0, 6);
    const url = this.urlRepository.create({
      originalUrl,
      shortUrl,
      owner: ownerId ? { id: ownerId } : null,
    });
    await this.urlRepository.save(url);
    return shortUrl;
  }

  async redirectToOriginal(shortUrl: string): Promise<string> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, deletedAt: null },
    });
    if (!url) throw new NotFoundException('URL not found or deleted');
    url.clickCount++;
    await this.urlRepository.save(url);
    await this.clickRepository.save({ url });
    return url.originalUrl;
  }

  async getUrlsByUser(userId: number): Promise<Url[]> {
    return this.urlRepository.find({
      where: { owner: { id: userId }, deletedAt: null },
      relations: ['clicks'],
    });
  }

  async updateOriginalUrl(
    shortUrl: string,
    newOriginalUrl: string,
  ): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl, deletedAt: null },
    });
    if (!url) throw new NotFoundException('URL not found or deleted');

    url.originalUrl = newOriginalUrl;
    await this.urlRepository.save(url);
  }

  async deleteUrl(shortUrl: string): Promise<void> {
    const url = await this.urlRepository.findOne({
      where: { shortUrl },
    });
    if (!url) throw new NotFoundException('URL not found');

    url.deletedAt = new Date();
    await this.urlRepository.save(url);
  }
}
