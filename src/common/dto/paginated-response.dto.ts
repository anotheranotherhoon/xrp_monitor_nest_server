import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

export class PageInfoDto {
  @ApiProperty({ example: 100, description: '전체 항목 수' })
  total: number;

  @ApiProperty({ example: 15, description: '페이지당 항목 수' })
  perPage: number;

  @ApiProperty({ example: 1, description: '현재 페이지' })
  currentPage: number;

  @ApiProperty({ example: 7, description: '마지막 페이지' })
  lastPage: number;
}

export class PaginatedResultDto<T> {
  @ApiProperty({ example: 11, description: '다음 커서 ID', nullable: true })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ isArray: true })
  list: T[];
}

export class PaginatedResponseDto<T> extends ResponseDto<
  PaginatedResultDto<T>
> {
  @ApiProperty({ type: PaginatedResultDto })
  result: PaginatedResultDto<T>;
}
