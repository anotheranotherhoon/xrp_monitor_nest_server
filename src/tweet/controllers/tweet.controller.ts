import {
  Controller,
  Get,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TweetService } from '../services/tweet.service';
import { ApiResponseWrapper } from '../../common/decorators/api-response.decorator';
import { TweetItemDto, TweetListResponseDto } from '../dto/tweet.dto';

@ApiTags('🐦tweet')
@Controller('tweet')
export class TweetController {
  constructor(private readonly tweetService: TweetService) {}

  @Get('users/:id/tweets')
  @ApiParam({ name: 'id', example: '25073877', description: 'Twitter user id' })
  @ApiQuery({ name: 'max_results', required: false, example: 10 })
  @ApiResponseWrapper(TweetListResponseDto, '특정 유저의 최근 트윗')
  async getUserTweets(
    @Param('id') id: string,
    @Query('max_results') maxResults?: number,
  ): Promise<TweetListResponseDto> {
    try {
      const validMax =
        maxResults && +maxResults > 0 && +maxResults <= 100 ? +maxResults : 10;
      const raw = await this.tweetService.getUserTweets({
        userId: id,
        maxResults: validMax,
      });
      const items: TweetItemDto[] = (raw?.data || []).map((it: any) => ({
        id: it?.id,
        text: it?.text,
        createdAt: it?.created_at,
        authorId: it?.author_id,
        lang: it?.lang,
      }));
      return {
        nextCursorId: raw?.meta?.next_token ?? null,
        pageSize: items.length,
        total: raw?.meta?.result_count,
        items,
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
  @ApiResponseWrapper(TweetListResponseDto, '트윗 최근 검색')
  async searchRecent(
    @Query('query') query: string,
    @Query('max_results') maxResults?: number,
    @Query('next_token') nextToken?: string,
  ): Promise<TweetListResponseDto> {
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
        id: it?.id,
        text: it?.text,
        createdAt: it?.created_at,
        authorId: it?.author_id,
        lang: it?.lang,
      }));
      return {
        nextCursorId: raw?.meta?.next_token ?? null,
        pageSize: items.length,
        total: raw?.meta?.result_count,
        items,
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
