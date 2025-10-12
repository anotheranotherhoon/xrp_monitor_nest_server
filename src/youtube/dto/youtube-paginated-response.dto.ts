import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from 'src/common/dto/paginated-response.dto';
import { YoutubeSearchItemDto } from './youtube-search.dto';

export class YoutubePaginatedResultDto {
  @ApiProperty({
    example: 'CAoQAA',
    description: '다음 커서 ID',
    nullable: true,
  })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({
    type: [YoutubeSearchItemDto],
    description: '유튜브 동영상 목록',
  })
  list: YoutubeSearchItemDto[];
}

export class YoutubePaginatedResponseDto {
  @ApiProperty({ type: YoutubePaginatedResultDto })
  result: YoutubePaginatedResultDto;
}
