import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Popup } from 'src/entities';
import { ObjectStorageService } from './object-storage.service';
import { PopupAdminController } from './popup-admin.controller';
import { PopupController } from './popup.controller';
import { PopupService } from './popup.service';

@Module({
  imports: [TypeOrmModule.forFeature([Popup])],
  controllers: [PopupController, PopupAdminController],
  providers: [PopupService, ObjectStorageService],
})
export class PopupModule {}
