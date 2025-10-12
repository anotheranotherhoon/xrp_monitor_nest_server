import { Injectable } from '@nestjs/common';
import { YoutubeRepository } from 'src/youtube/repositories/youtube.repository';

@Injectable()
export class YoutubeService {
  constructor(private readonly youtubeRepository: YoutubeRepository) {}

  async searchXrpVideos(options: {
    query: string;
    order?:
      | 'date'
      | 'rating'
      | 'relevance'
      | 'title'
      | 'videoCount'
      | 'viewCount';
    maxResults?: number;
    pageToken?: string;
  }): Promise<any> {
    return this.youtubeRepository.searchVideos(options);
  }
}
