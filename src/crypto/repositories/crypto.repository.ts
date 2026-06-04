import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { createHash } from 'crypto';
import { firstValueFrom } from 'rxjs';
import { Repository } from 'typeorm';
import { TweetCache } from 'src/entities';

@Injectable()
export class CryptoRepository {
  private readonly cacheTtlMs = 24 * 60 * 60 * 1000;

  constructor(
    private readonly httpService: HttpService,
    @InjectRepository(TweetCache)
    private readonly cacheRepository: Repository<TweetCache>,
  ) {}

  async getXrpNews(params: { perPage?: number; cursorId?: string }) {
    const { perPage = 10, cursorId } = params;
    const requestParams = {
      categories: 'XRP',
      lang: 'EN',
      perPage,
      ...(cursorId && cursorId !== '-1' ? { lTs: cursorId } : {}),
    };

    return this.withTwentyFourHourCache(
      'cryptocompare-xrp-news',
      requestParams,
      async () => {
        const response$ = this.httpService.get('/data/v2/news/', {
          params: {
            categories: 'XRP',
            lang: 'EN',
            sortOrder: 'latest',
            extraParams: 'xrp_monitor',
            ...(cursorId && cursorId !== '-1' ? { lTs: cursorId } : {}),
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
    const cached = await this.cacheRepository.findOne({
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
      throw error;
    }
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
    const cache = params.cached ?? this.cacheRepository.create();
    cache.tcCacheKey = params.cacheKey;
    cache.tcRequestType = params.requestType;
    cache.tcRequestParams = params.requestParams;
    cache.tcResponseBody = params.responseBody;
    cache.tcFetchedAt = new Date();
    await this.cacheRepository.save(cache);
  }
}
