import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { YoutubeController } from './controllers/youtube.controller';
import { YoutubeService } from './services/youtube.service';
import { YoutubeRepository } from './repositories/youtube.repository';

@Module({
  imports: [HttpModule],
  controllers: [YoutubeController],
  providers: [YoutubeService, YoutubeRepository],
})
export class YoutubeModule {}
