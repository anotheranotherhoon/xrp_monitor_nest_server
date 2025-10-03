import { ApiProperty } from '@nestjs/swagger';

export class NaverNewsItemDto {
  @ApiProperty({ example: '뉴스 속보입니다.', description: '뉴스 제목' })
  neTitle: string;

  @ApiProperty({
    example:
      'https://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=101&oid=001&aid=001234567890',
    description: '뉴스 원본 링크',
  })
  neOriginalLink: string;

  @ApiProperty({
    example:
      'https://news.naver.com/main/read.nhn?mode=LSD&mid=shm&sid1=101&oid=001&aid=001234567890',
    description: '뉴스 링크',
  })
  neLink: string;

  @ApiProperty({ example: '뉴스 속보입니다.', description: '뉴스 내용' })
  neDescription: string;

  @ApiProperty({
    example: '2024-01-01T12:34:56.000Z',
    description: '뉴스 작성 시간',
  })
  neCreatedAt: string;
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
