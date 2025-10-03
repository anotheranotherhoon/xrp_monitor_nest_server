import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from '../../common/dto/paginated-response.dto';
import { NaverNewsItemDto } from './naver-news.dto';

export class NewsPaginatedResultDto {
  @ApiProperty({ example: 11, description: '다음 커서 ID', nullable: true })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ type: [NaverNewsItemDto], description: '뉴스 목록' })
  list: NaverNewsItemDto[];
}

export class NewsPaginatedResponseDto {
  @ApiProperty({ type: NewsPaginatedResultDto })
  result: NewsPaginatedResultDto;
}
