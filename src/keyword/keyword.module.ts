import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { KeywordController } from './keyword.controller';
import { KeywordAdminController } from './keyword-admin.controller';
import { KeywordService } from './keyword.service';
import { Keyword } from 'src/entities/keyword.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Keyword])],
  controllers: [KeywordController, KeywordAdminController],
  providers: [KeywordService],
  exports: [KeywordService],
})
export class KeywordModule {}
