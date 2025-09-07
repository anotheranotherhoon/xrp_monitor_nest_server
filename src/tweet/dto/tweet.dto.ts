import { ApiProperty } from '@nestjs/swagger';

export class TweetItemDto {
  @ApiProperty({ example: '1234567890123456789', description: '트윗 ID' })
  id: string;

  @ApiProperty({ example: 'XRP to the moon 🚀', description: '트윗 내용' })
  text: string;

  @ApiProperty({ example: '2024-01-01T12:34:56.000Z', required: false })
  createdAt?: string;

  @ApiProperty({ example: '25073877', required: false })
  authorId?: string;

  @ApiProperty({ example: 'en', required: false })
  lang?: string;
}

export class TweetListResponseDto {
  @ApiProperty({
    type: String,
    nullable: true,
    example: 'b26v89c19zqg8o3fosdf',
    description: '다음 페이지 호출에 사용할 커서(없으면 null)',
  })
  nextCursorId: string | null;

  @ApiProperty({ example: 10, description: '이번 응답의 아이템 개수' })
  pageSize: number;

  @ApiProperty({
    example: 1234,
    required: false,
    description: '전체 개수(알 수 없으면 생략)',
  })
  total?: number;

  @ApiProperty({ isArray: true, type: TweetItemDto })
  items: TweetItemDto[];
}
