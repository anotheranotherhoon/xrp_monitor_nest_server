import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from 'src/common/dto/paginated-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { NaverNewsItemDto } from './naver-news.dto';

export class NewsPaginatedResultDto {
  @ApiProperty({
    example: 11,
    description: '다음 호출에 사용할 커서(없으면 null)',
    nullable: true,
  })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ type: [NaverNewsItemDto], description: '뉴스 목록' })
  list: NaverNewsItemDto[];
}

export class NewsPaginatedResponseDto extends ResponseDto<NewsPaginatedResultDto> {
  @ApiProperty({ type: NewsPaginatedResultDto })
  result: NewsPaginatedResultDto;
}
