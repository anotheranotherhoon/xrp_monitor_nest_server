import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { NewsModule } from './news/news.module';
import { YoutubeModule } from './youtube/youtube.module';
import { TweetModule } from './tweet/tweet.module';
import { ScheduleModule } from '@nestjs/schedule';
import { UpbitModule } from './upbit/upbit.module';
import { AuthModule } from './auth/auth.module';
import { XrpModule } from './xrp/xrp.module';
import { VersionModule } from './version/version.module';
import { AdminModule } from './admin/admin.module';
import { KeywordModule } from './keyword/keyword.module';
import { CryptoModule } from './crypto/crypto.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import {
  User,
  XrpHolding,
  AppVersion,
  Keyword,
  TweetCache,
  Popup,
} from './entities';
import { PopupModule } from './popup/popup.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT) || 5432,
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_DATABASE || 'xrp',
      entities: [User, XrpHolding, AppVersion, Keyword, TweetCache, Popup],
      synchronize: true,
      ssl: false,
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    AuthModule,
    NewsModule,
    YoutubeModule,
    TweetModule,
    CryptoModule,
    UpbitModule,
    XrpModule,
    VersionModule,
    AdminModule,
    KeywordModule,
    PopupModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
