import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { YoutubeService } from '../services/youtube.service';
import { YoutubeSearchItemDto } from '../dto/youtube-search.dto';
import {
  YoutubePaginatedResponseDto,
  YoutubePaginatedResultDto,
} from '../dto/youtube-paginated-response.dto';
import { Public } from '../../auth/decorators/public.decorator';

@ApiTags('▶️youtube')
@Controller('youtube')
@Public()
export class YoutubeController {
  constructor(private readonly youtubeService: YoutubeService) {}

  @Get('search')
  @ApiOkResponse({
    type: YoutubePaginatedResponseDto,
    description: 'XRP 유튜브 검색 (커서 방식)',
  })
  @ApiQuery({
    name: 'q',
    required: false,
    example: 'XRP Ripple',
    description: '검색어',
  })
  @ApiQuery({
    name: 'order',
    required: false,
    example: 'date',
    enum: ['date', 'rating', 'relevance', 'title', 'videoCount', 'viewCount'],
  })
  @ApiQuery({
    name: 'maxResults',
    required: false,
    example: 10,
    description: '가져올 개수(최대 50)',
  })
  @ApiQuery({
    name: 'cursorId',
    required: false,
    example: '-1',
    description: '첫 호출은 -1, 이후 응답의 nextCursorId 사용',
  })
  async search(
    @Query('q') q?: string,
    @Query('order')
    order?:
      | 'date'
      | 'rating'
      | 'relevance'
      | 'title'
      | 'videoCount'
      | 'viewCount',
    @Query('maxResults') maxResults?: number,
    @Query('cursorId') cursorId?: string,
  ): Promise<YoutubePaginatedResultDto> {
    try {
      const query = q && q.trim().length > 0 ? q : 'XRP Ripple';
      const validMax =
        maxResults && +maxResults > 0 && +maxResults <= 50 ? +maxResults : 10;
      const raw = await this.youtubeService.searchXrpVideos({
        query,
        order: order || 'date',
        maxResults: validMax,
        pageToken: cursorId && cursorId !== '-1' ? cursorId : undefined,
      });
      const items: YoutubeSearchItemDto[] = (raw?.items || [])
        .filter((it) => it?.id?.kind === 'youtube#video')
        .map((it) => ({
          yoVideoId: it?.id?.videoId,
          yoTitle: it?.snippet?.title,
          yoDescription: it?.snippet?.description,
          yoCreatedAt: it?.snippet?.publishedAt,
          yoChannelId: it?.snippet?.channelId,
          yoChannelTitle: it?.snippet?.channelTitle,
          thumbnails: it?.snippet?.thumbnails,
        }));

      const pageInfo = raw?.pageInfo || {};
      const total = pageInfo?.totalResults || items.length;
      const perPage = pageInfo?.resultsPerPage || items.length;
      const currentPage = 1;
      const lastPage = Math.max(1, Math.ceil(total / perPage));

      return {
        nextCursor: raw?.nextPageToken ?? null,
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
        '유튜브 검색 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
