import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UrlsModule } from './urls/urls.module';
import { User } from './auth/user.entity';
import { Url } from './urls/url.entity';
import { Click } from './urls/click.entity';
import { LoggerModule } from './utils/logger.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DATABASE_HOST,
      port: parseInt(process.env.DATABASE_PORT, 10),
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      entities: [User, Url, Click],
      synchronize: true,
    }),
    AuthModule,
    UrlsModule,
    LoggerModule,
  ],
})
export class AppModule {}
