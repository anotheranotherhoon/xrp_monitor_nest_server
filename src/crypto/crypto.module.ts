import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TweetCache } from 'src/entities';
import { CryptoController } from './controllers/crypto.controller';
import { CryptoService } from './services/crypto.service';
import { CryptoRepository } from './repositories/crypto.repository';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([TweetCache]),
    HttpModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        baseURL: 'https://min-api.cryptocompare.com',
        timeout: 10000,
        params: {
          api_key: configService.get<string>('CRYPTO_COMPARE'),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [CryptoController],
  providers: [CryptoService, CryptoRepository],
})
export class CryptoModule {}
