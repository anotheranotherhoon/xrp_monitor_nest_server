import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TweetService } from 'src/tweet/services/tweet.service';
import { TweetItemDto } from 'src/tweet/dto/tweet.dto';
import {
  TweetPaginatedResponseDto,
  TweetPaginatedResultDto,
} from 'src/tweet/dto/tweet-paginated-response.dto';

@ApiTags('🐦tweet')
@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  private formatToKoreanTime(dateString: string): string {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return dateString;
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
    } catch (error) {
      console.log(error);
      return dateString;
    }
  }

  @Get('users/:id/tweets')
  @ApiParam({ name: 'id', example: '25073877', description: 'Twitter user id' })
  @ApiQuery({ name: 'max_results', required: false, example: 10 })
  @ApiOkResponse({
    type: TweetPaginatedResponseDto,
    description: '특정 유저의 최근 트윗',
  })
  async getUserTweets(
    @Param('id') id: string,
    @Query('max_results') maxResults?: number,
  ): Promise<TweetPaginatedResultDto> {
    try {
      const validMax =
        maxResults && +maxResults > 0 && +maxResults <= 100 ? +maxResults : 10;
      const raw = await this.tweetService.getUserTweets({
        userId: id,
        maxResults: validMax,
      });
      const items: TweetItemDto[] = (raw?.data || []).map((it: any) => ({
        twId: it?.id,
        twText: it?.text,
        twCreatedAt:
          this.formatToKoreanTime(it?.created_at) || it?.created_at || '',
        twAuthorId: it?.author_id,
        twLang: it?.lang,
      }));
      const total = raw?.meta?.result_count || items.length;
      const perPage = validMax;
      const currentPage = 1;
      const lastPage = Math.max(1, Math.ceil(total / perPage));

      return {
        nextCursor: raw?.meta?.next_token ?? null,
        page: {
          total: total,
          perPage: perPage,
          currentPage: currentPage,
          lastPage: lastPage,
        },
        list: items,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        '트윗 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('search/recent')
  @ApiQuery({ name: 'query', required: true, example: 'xrp' })
  @ApiQuery({ name: 'max_results', required: false, example: 10 })
  @ApiQuery({ name: 'next_token', required: false, example: undefined })
  @ApiOkResponse({
    type: TweetPaginatedResponseDto,
    description: '트윗 최근 검색',
  })
  async searchRecent(
    @Query('query') query: string,
    @Query('max_results') maxResults?: number,
    @Query('next_token') nextToken?: string,
  ): Promise<TweetPaginatedResultDto> {
    try {
      if (!query || query.trim().length === 0) {
        throw new HttpException(
          'query 파라미터는 필수입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const validMax =
        maxResults && +maxResults > 0 && +maxResults <= 100 ? +maxResults : 10;
      const raw = await this.tweetService.searchRecent({
        query,
        maxResults: validMax,
        nextToken,
      });
      const items: TweetItemDto[] = (raw?.data || []).map((it: any) => ({
        twId: it?.id,
        twText: it?.text,
        twCreatedAt:
          this.formatToKoreanTime(it?.created_at) || it?.created_at || '',
        twAuthorId: it?.author_id,
        twLang: it?.lang,
      }));
      const total = raw?.meta?.result_count || items.length;
      const perPage = validMax;
      const currentPage = 1;
      const lastPage = Math.max(1, Math.ceil(total / perPage));

      return {
        nextCursor: raw?.meta?.next_token ?? null,
        page: {
          total: total,
          perPage: perPage,
          currentPage: currentPage,
          lastPage: lastPage,
        },
        list: items,
      };
    } catch (error) {
      if (error instanceof HttpException) throw error;
      throw new HttpException(
        '트윗 검색 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
