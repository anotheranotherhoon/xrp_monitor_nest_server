import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { YoutubeModule } from './youtube/youtube.module';
import { TweetModule } from './tweet/tweet.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpbitModule } from './upbit/upbit.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    NewsModule,
    YoutubeModule,
    TweetModule,
    UpbitModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
