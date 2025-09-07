import {
  Controller,
  Get,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { NewsService, NaverNewsResponse } from '../services/news.service';
import { ApiResponseWrapper } from '../../common/decorators/api-response.decorator';
import { NaverNewsInfiniteResponseDto } from '../dto/naver-news.dto';

@ApiTags('📰news')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get('xrp/cursor')
  @ApiResponseWrapper(
    NaverNewsInfiniteResponseDto,
    'XRP 뉴스 목록 조회 (커서 방식: 첫 호출 cursorId=-1)',
  )
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
  ): Promise<NaverNewsResponse> {
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

      return { ...data, nextCursorId } as any;
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
  @ApiResponseWrapper(
    NaverNewsInfiniteResponseDto,
    'XRP 뉴스 목록 조회 (offset 방식)',
  )
  async getXrpNewsByOffset(
    @Query('offset') offset?: number,
    @Query('limit') limit?: number,
    @Query('sort') sort?: string,
  ): Promise<NaverNewsResponse> {
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
      return data as any;
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
