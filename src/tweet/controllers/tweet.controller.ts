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
  @ApiQuery({
    name: 'perPage',
    required: false,
    example: 10,
    description: '페이지당 항목 수(1-100), 기본 10',
  })
  @ApiQuery({
    name: 'max_results',
    required: false,
    example: 10,
    description: '기존 호출 호환용. 신규 호출은 perPage 사용',
    deprecated: true,
  })
  @ApiQuery({
    name: 'cursorId',
    required: false,
    example: '-1',
    description: '첫 호출은 -1, 이후 응답의 nextCursor 사용',
  })
  @ApiOkResponse({
    type: TweetPaginatedResponseDto,
    description: '특정 유저의 최근 트윗',
  })
  async getUserTweets(
    @Param('id') id: string,
    @Query('perPage') perPage?: string,
    @Query('max_results') maxResults?: string,
    @Query('cursorId') cursorId?: string,
  ): Promise<TweetPaginatedResultDto> {
    try {
      const validPerPage = this.parseBoundedInt(perPage ?? maxResults, 10, 100);
      const raw = await this.tweetService.getUserTweets({
        userId: id,
        maxResults: validPerPage,
        nextToken: cursorId && cursorId !== '-1' ? cursorId : undefined,
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
      const responsePerPage = validPerPage;
      const currentPage = 1;
      const lastPage = Math.max(1, Math.ceil(total / responsePerPage));

      return {
        nextCursor: raw?.meta?.next_token ?? null,
        page: {
          total: total,
          perPage: responsePerPage,
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
  @ApiQuery({
    name: 'perPage',
    required: false,
    example: 10,
    description: '페이지당 항목 수(1-100), 기본 10',
  })
  @ApiQuery({
    name: 'max_results',
    required: false,
    example: 10,
    description: '기존 호출 호환용. 신규 호출은 perPage 사용',
    deprecated: true,
  })
  @ApiQuery({
    name: 'cursorId',
    required: false,
    example: '-1',
    description: '첫 호출은 -1, 이후 응답의 nextCursor 사용',
  })
  @ApiQuery({
    name: 'next_token',
    required: false,
    example: undefined,
    description: '기존 호출 호환용. 신규 호출은 cursorId 사용',
  })
  @ApiOkResponse({
    type: TweetPaginatedResponseDto,
    description: '트윗 최근 검색',
  })
  async searchRecent(
    @Query('query') query: string,
    @Query('perPage') perPage?: string,
    @Query('max_results') maxResults?: string,
    @Query('next_token') nextToken?: string,
    @Query('cursorId') cursorId?: string,
  ): Promise<TweetPaginatedResultDto> {
    try {
      if (!query || query.trim().length === 0) {
        throw new HttpException(
          'query 파라미터는 필수입니다.',
          HttpStatus.BAD_REQUEST,
        );
      }
      const validPerPage = this.parseBoundedInt(perPage ?? maxResults, 10, 100);
      const effectiveNextToken =
        nextToken || (cursorId && cursorId !== '-1' ? cursorId : undefined);
      const raw = await this.tweetService.searchRecent({
        query,
        maxResults: validPerPage,
        nextToken: effectiveNextToken,
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
      const responsePerPage = validPerPage;
      const currentPage = 1;
      const lastPage = Math.max(1, Math.ceil(total / responsePerPage));

      return {
        nextCursor: raw?.meta?.next_token ?? null,
        page: {
          total: total,
          perPage: responsePerPage,
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
