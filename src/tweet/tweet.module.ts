import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TweetController } from './controllers/tweet.controller';
import { TweetService } from './services/tweet.service';
import { TweetRepository } from './repositories/tweet.repository';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: 'https://api.twitter.com/2',
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${configService.get<string>('X_BEARER_TOKEN')}`,
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [TweetController],
  providers: [TweetService, TweetRepository],
  exports: [TweetService],
})
export class TweetModule {}
