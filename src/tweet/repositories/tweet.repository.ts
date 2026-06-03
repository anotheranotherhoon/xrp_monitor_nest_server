import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { TweetCache } from 'src/entities';

@Injectable()
export class TweetRepository {
  private readonly cacheTtlMs = 24 * 60 * 60 * 1000;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(TweetCache)
    private readonly tweetCacheRepository: Repository<TweetCache>,
  ) {}

  async getUserTweets(params: { userId: string; maxResults?: number }) {
    const { userId, maxResults = 10 } = params;
    const requestParams = { userId, maxResults };
    return this.withTwentyFourHourCache(
      'user-tweets',
      requestParams,
      async () => {
        const url = `/users/${userId}/tweets`;
        const response$ = this.httpService.get(url, {
          params: {
            max_results: maxResults,
            'tweet.fields': 'created_at,author_id,lang',
          },
        });
        const { data } = await firstValueFrom(response$);
        return data;
      },
    );
  }

  async searchRecent(params: {
    query: string;
    maxResults?: number;
    nextToken?: string;
  }) {
    const { query, maxResults = 10, nextToken } = params;
    const requestParams = { query, maxResults, nextToken: nextToken ?? null };
    return this.withTwentyFourHourCache(
      'search-recent',
      requestParams,
      async () => {
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
      },
    );
  }

  private async withTwentyFourHourCache<T extends Record<string, unknown>>(
    requestType: string,
    requestParams: Record<string, unknown>,
    fetcher: () => Promise<T>,
  ): Promise<T> {
    const normalizedParams = this.normalizeParams(requestParams);
    const cacheKey = this.createCacheKey(requestType, normalizedParams);
    const cached = await this.tweetCacheRepository.findOne({
      where: { tcCacheKey: cacheKey },
    });

    if (cached && this.isFresh(cached.tcFetchedAt)) {
      return cached.tcResponseBody as T;
    }

    try {
      const responseBody = await fetcher();
      await this.saveCache({
        cached,
        cacheKey,
        requestType,
        requestParams: normalizedParams,
        responseBody,
      });
      return responseBody;
    } catch (error) {
      if (cached) {
        return cached.tcResponseBody as T;
      }
      if (this.isExternalApiError(error)) {
        return this.createEmptyTwitterResponse() as T;
      }
      throw error;
    }
  }

  private isExternalApiError(error: unknown): boolean {
    const status = (error as { response?: { status?: number } })?.response
      ?.status;
    return typeof status === 'number' && status >= 400;
  }

  private createEmptyTwitterResponse(): Record<string, unknown> {
    return {
      data: [],
      meta: {
        result_count: 0,
      },
    };
  }

  private isFresh(fetchedAt: Date): boolean {
    return Date.now() - fetchedAt.getTime() < this.cacheTtlMs;
  }

  private createCacheKey(
    requestType: string,
    requestParams: Record<string, unknown>,
  ): string {
    return createHash('sha256')
      .update(`${requestType}:${JSON.stringify(requestParams)}`)
      .digest('hex');
  }

  private normalizeParams(
    requestParams: Record<string, unknown>,
  ): Record<string, unknown> {
    return Object.keys(requestParams)
      .sort()
      .reduce<Record<string, unknown>>((acc, key) => {
        acc[key] = requestParams[key] ?? null;
        return acc;
      }, {});
  }

  private async saveCache(params: {
    cached?: TweetCache | null;
    cacheKey: string;
    requestType: string;
    requestParams: Record<string, unknown>;
    responseBody: Record<string, unknown>;
  }): Promise<void> {
    const cache = params.cached ?? this.tweetCacheRepository.create();
    cache.tcCacheKey = params.cacheKey;
    cache.tcRequestType = params.requestType;
    cache.tcRequestParams = params.requestParams;
    cache.tcResponseBody = params.responseBody;
    cache.tcFetchedAt = new Date();
    await this.tweetCacheRepository.save(cache);
  }
}
