import { Module } from '@nestjs/common';
import { customLogger } from './logger';

@Module({
  providers: [
    {
      provide: 'Logger',
      useValue: customLogger,
    },
  ],
  exports: ['Logger'],
})
export class LoggerModule {}
