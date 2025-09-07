import { ApiProperty } from '@nestjs/swagger';

export class NaverNewsItemDto {
  @ApiProperty()
  title: string;

  @ApiProperty()
  originallink: string;

  @ApiProperty()
  link: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  pubDate: string;
}

export class NaverNewsResponseDto {
  @ApiProperty()
  lastBuildDate: string;

  @ApiProperty()
  total: number;

  @ApiProperty()
  start: number;

  @ApiProperty()
  display: number;

  @ApiProperty({ type: [NaverNewsItemDto] })
  items: NaverNewsItemDto[];
}

export class NaverNewsInfiniteResponseDto extends NaverNewsResponseDto {
  @ApiProperty({
    example: 11,
    nullable: true,
    description: '다음 호출에 사용할 cursorId(없으면 null)',
  })
  nextCursorId: number | null;
}
