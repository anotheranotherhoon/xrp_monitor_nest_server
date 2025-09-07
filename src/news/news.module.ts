import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { NewsController } from './controllers/news.controller';
import { NewsService } from './services/news.service';

@Module({
  imports: [
    ConfigModule,
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: 'https://openapi.naver.com',
        timeout: 5000,
        headers: {
          'X-Naver-Client-Id': configService.get<string>('NAVER_CLIENT_ID'),
          'X-Naver-Client-Secret': configService.get<string>(
            'NAVER_CLIENT_SECRET_KEY',
          ),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [NewsController],
  providers: [NewsService],
  exports: [NewsService],
})
export class NewsModule {}
