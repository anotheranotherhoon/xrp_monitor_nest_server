import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class TweetRepository {
  constructor(private readonly httpService: HttpService) {}

  async getUserTweets(params: { userId: string; maxResults?: number }) {
    const { userId, maxResults = 10 } = params;
    const url = `/users/${userId}/tweets`;
    const response$ = this.httpService.get(url, {
      params: {
        max_results: maxResults,
        'tweet.fields': 'created_at,author_id,lang',
      },
    });
    const { data } = await firstValueFrom(response$);
    return data;
  }

  async searchRecent(params: {
    query: string;
    maxResults?: number;
    nextToken?: string;
  }) {
    const { query, maxResults = 10, nextToken } = params;
    const url = `/tweets/search/recent`;
    const response$ = this.httpService.get(url, {
      params: {
        query,
        max_results: maxResults,
        next_token: nextToken,
        'tweet.fields': 'created_at,author_id,lang',
      },
    });
    const { data } = await firstValueFrom(response$);
    return data;
  }
}
