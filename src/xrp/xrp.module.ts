import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { XrpController } from './xrp.controller';
import { XrpService } from './xrp.service';
import { XrpHolding } from '../entities/xrp-holding.entity';

@Module({
  imports: [TypeOrmModule.forFeature([XrpHolding])],
  controllers: [XrpController],
  providers: [XrpService],
  exports: [XrpService],
})
export class XrpModule {}
