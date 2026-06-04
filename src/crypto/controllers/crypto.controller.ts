import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CryptoService } from '../services/crypto.service';
import { TweetItemDto } from 'src/tweet/dto/tweet.dto';
import { TweetPaginatedResultDto } from 'src/tweet/dto/tweet-paginated-response.dto';

@ApiTags('₿crypto')
@Controller('crypto')
export class CryptoController {
  constructor(private readonly cryptoService: CryptoService) {}

  private parseBoundedInt(
    value: string | undefined,
    defaultValue: number,
    maxValue: number,
  ): number {
    const parsed = Number(value);
    return Number.isInteger(parsed) && parsed > 0 && parsed <= maxValue
      ? parsed
      : defaultValue;
  }

  private formatToKoreanTime(unixSeconds?: number): string {
    if (!unixSeconds) return '';
    const date = new Date(Number(unixSeconds) * 1000);
    const koreanTime = new Date(
      date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
    );
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreanTime.getDate()).padStart(2, '0');
    const hours = String(koreanTime.getHours()).padStart(2, '0');
    const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
    const seconds = String(koreanTime.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  @Get('news/xrp')
  @ApiQuery({
    name: 'cursorId',
    required: false,
    example: '-1',
    description: '첫 호출은 -1, 이후 응답의 nextCursor 사용',
  })
  @ApiQuery({
    name: 'perPage',
    required: false,
    example: 10,
    description: '페이지당 항목 수(1-50), 기본 10',
  })
  @ApiOkResponse({
    description: 'CryptoCompare XRP 기사 목록',
  })
  async getXrpCryptoNews(
    @Query('cursorId') cursorId?: string,
    @Query('perPage') perPage?: string,
  ): Promise<TweetPaginatedResultDto> {
    try {
      const validPerPage = this.parseBoundedInt(perPage, 10, 50);
      const raw = await this.cryptoService.getXrpNews({
        cursorId,
        perPage: validPerPage,
      });
      if (raw?.Response === 'Error') {
        throw new HttpException(
          raw?.Message || 'CryptoCompare API 오류가 발생했습니다.',
          HttpStatus.BAD_GATEWAY,
        );
      }

      const articles = (raw?.Data || raw?.data || []).slice(0, validPerPage);
      const items: TweetItemDto[] = articles.map((article: any) => ({
        twId: article?.url || article?.guid || String(article?.id || ''),
        twText: [article?.title, article?.body].filter(Boolean).join('\n\n'),
        twCreatedAt: this.formatToKoreanTime(article?.published_on),
        twAuthorId:
          article?.source_info?.name || article?.source || 'CryptoCompare',
        twLang: article?.categories || article?.lang || '',
      }));
      const oldestPublishedOn = articles.at(-1)?.published_on;

      return {
        nextCursor: oldestPublishedOn
          ? String(Number(oldestPublishedOn) - 1)
          : null,
        page: {
          total: items.length,
          perPage: validPerPage,
          currentPage: 1,
          lastPage: 1,
        },
        list: items,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        'CryptoCompare 기사 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
