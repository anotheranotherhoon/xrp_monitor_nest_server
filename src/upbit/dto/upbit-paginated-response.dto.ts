import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from '../../common/dto/paginated-response.dto';
import { UpbitSocketDocsDto } from './socket-docs.dto';

export class UpbitPaginatedResultDto {
  @ApiProperty({ example: null, description: '다음 커서 ID', nullable: true })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ type: [UpbitSocketDocsDto], description: 'Upbit 소켓 문서' })
  list: UpbitSocketDocsDto[];
}

export class UpbitPaginatedResponseDto {
  @ApiProperty({ type: UpbitPaginatedResultDto })
  result: UpbitPaginatedResultDto;
}
