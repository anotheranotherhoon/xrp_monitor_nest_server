import { ApiProperty } from '@nestjs/swagger';

export class CursorPageDto<TItem> {
  @ApiProperty({
    type: Number,
    nullable: true,
    oneOf: [{ type: 'string' }, { type: 'number' }],
    example: 'CAoQAA',
    description: '다음 호출에 사용할 커서(없으면 null)',
  } as any)
  nextCursor: string | number | null;

  @ApiProperty({
    example: 10,
    description: '페이지당 항목 수',
  })
  perPage: number;

  @ApiProperty({
    example: 1234,
    required: false,
    description: '전체 개수(알 수 없으면 생략)',
  })
  total?: number;

  @ApiProperty({ isArray: true })
  list: TItem[];
}
