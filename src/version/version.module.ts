import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { VersionController } from './version.controller';
import { VersionAdminController } from './version-admin.controller';
import { VersionService } from './version.service';
import { AppVersion } from 'src/entities/app-version.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AppVersion])],
  controllers: [VersionController, VersionAdminController],
  providers: [VersionService],
  exports: [VersionService],
})
export class VersionModule {}
