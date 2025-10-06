import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewsService } from '../services/news.service';
import { NaverNewsItemDto } from '../dto/naver-news.dto';
import {
  NewsPaginatedResponseDto,
  NewsPaginatedResultDto,
} from '../dto/news-paginated-response.dto';

@ApiTags('📰news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  private formatToKoreanTime(dateString: string): string {
    if (!dateString) return '';
    const date = new Date(dateString);
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

  @Get('xrp/cursor')
  @ApiOkResponse({
    type: NewsPaginatedResponseDto,
    description: 'XRP 뉴스 목록 조회 (커서 방식: 첫 호출 cursorId=-1)',
  })
  @ApiQuery({
    name: 'cursorId',
    required: true,
    example: -1,
    description: '첫 호출은 -1, 이후에는 응답의 nextCursorId 사용',
  })
  @ApiQuery({
    name: 'display',
    required: false,
    example: 10,
    description: '한 번에 가져올 개수(1-100), 기본 10',
  })
  @ApiQuery({
    name: 'sort',
    required: false,
    example: 'date',
    enum: ['date', 'sim'],
    description: '정렬 방식, 기본 date',
  })
  async getXrpNews(
    @Query('display') display?: number,
    @Query('sort') sort?: string,
    @Query('cursorId') cursorId?: number,
  ): Promise<NewsPaginatedResultDto> {
    try {
      // display 파라미터 검증 (1-100 사이)
      const validDisplay =
        display && display > 0 && display <= 100 ? display : 10;

      // sort 파라미터 검증 (date, sim)
      const validSort = sort === 'sim' ? 'sim' : 'date';

      // 커서 규칙: 첫 호출은 cursorId = -1 → start = 1로 매핑
      const validStart =
        cursorId === -1 ? 1 : cursorId && cursorId > 0 ? cursorId : 1;
      const data = await this.newsService.getXrpNews(
        validDisplay,
        validSort,
        validStart,
      );

      const hasMore = data.start + data.display <= data.total;
      const nextCursorId = hasMore ? data.start + data.display : null;

      const currentPage = Math.ceil(data.start / data.display);
      const lastPage = Math.ceil(data.total / data.display);

      const items: NaverNewsItemDto[] = data.items.map((item) => ({
        neTitle: item.title,
        neOriginalLink: item.originallink,
        neLink: item.link,
        neDescription: item.description,
        neCreatedAt: this.formatToKoreanTime(item.pubDate),
      }));

      return {
        nextCursor: nextCursorId,
        page: {
          total: data.total,
          perPage: data.display,
          currentPage: currentPage,
          lastPage: lastPage,
        },
        list: items,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        '뉴스 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('xrp/offset')
  @ApiOkResponse({
    type: NewsPaginatedResponseDto,
    description: 'XRP 뉴스 목록 조회 (offset 방식)',
  })
  async getXrpNewsByOffset(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ): Promise<NewsPaginatedResultDto> {
    try {
      const validLimit = limit && limit > 0 && limit <= 100 ? limit : 10;
      const validSort = sort === 'sim' ? 'sim' : 'date';
      // Naver API start는 1-base. offset이 0-base라고 가정하여 +1
      const startFromOffset = (offset && offset >= 0 ? offset : 0) + 1;

      const data = await this.newsService.getXrpNews(
        validLimit,
        validSort,
        startFromOffset,
      );

      const currentPage = Math.ceil(startFromOffset / validLimit);
      const lastPage = Math.ceil(data.total / validLimit);
      const hasMore = startFromOffset + validLimit <= data.total;
      const nextCursor = hasMore ? startFromOffset + validLimit - 1 : null;

      const items: NaverNewsItemDto[] = data.items.map((item) => ({
        neTitle: item.title,
        neOriginalLink: item.originallink,
        neLink: item.link,
        neDescription: item.description,
        neCreatedAt: this.formatToKoreanTime(item.pubDate),
      }));

      return {
        nextCursor: nextCursor,
        page: {
          total: data.total,
          perPage: validLimit,
          currentPage: currentPage,
          lastPage: lastPage,
        },
        list: items,
      };
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      throw new HttpException(
        '뉴스 조회 중 오류가 발생했습니다.',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
