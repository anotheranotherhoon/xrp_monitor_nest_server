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
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { User, XrpHolding, AppVersion } from './entities';

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
      entities: [User, XrpHolding, AppVersion],
      synchronize: process.env.NODE_ENV !== 'production',
      ssl: process.env.NODE_ENV === 'production',
    }),
    HttpModule,
    ScheduleModule.forRoot(),
    AuthModule,
    NewsModule,
    YoutubeModule,
    TweetModule,
    UpbitModule,
    XrpModule,
    VersionModule,
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
