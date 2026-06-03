import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from 'src/common/dto/paginated-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { YoutubeSearchItemDto } from './youtube-search.dto';

export class YoutubePaginatedResultDto {
  @ApiProperty({
    example: 'CAoQAA',
    description: '다음 호출에 사용할 커서(없으면 null)',
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

export class YoutubePaginatedResponseDto extends ResponseDto<YoutubePaginatedResultDto> {
  @ApiProperty({ type: YoutubePaginatedResultDto })
  result: YoutubePaginatedResultDto;
}
