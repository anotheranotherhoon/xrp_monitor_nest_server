import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class YoutubeRepository {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  async searchVideos(params: {
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
    const apiKey = this.configService.get<string>('YOUTUBE_API_KEY');
    if (!apiKey) {
      throw new Error('YOUTUBE_API_KEY is not configured');
    }

    const { query, order = 'date', maxResults = 10, pageToken } = params;

    const url = 'https://www.googleapis.com/youtube/v3/search';
    const response$ = this.httpService.get(url, {
      params: {
        key: apiKey,
        part: 'snippet',
        q: query,
        type: 'video',
        order,
        maxResults,
        pageToken,
      },
    });

    const { data } = await firstValueFrom(response$);
    return data;
  }
}
