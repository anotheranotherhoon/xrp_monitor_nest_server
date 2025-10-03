import { Module } from '@nestjs/common';
import { UpbitService } from './services/upbit.service';
import { UpbitGateway } from './gateways/upbit.gateway';
import { UpbitController } from './controllers/upbit.controller';

@Module({
  imports: [],
  controllers: [UpbitController],
  providers: [UpbitService, UpbitGateway],
  exports: [UpbitService],
})
export class UpbitModule {}
