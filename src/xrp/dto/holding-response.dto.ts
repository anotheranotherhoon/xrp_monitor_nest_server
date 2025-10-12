import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from '../../common/dto/paginated-response.dto';

export class XrpHoldingDto {
  @ApiProperty({ example: 1, description: '보유 정보 고유 식별자' })
  hoIdx: number;

  @ApiProperty({ example: '1000.12345600', description: 'XRP 보유 수량' })
  hoQuantity: string;

  @ApiProperty({ example: '650.50', description: 'XRP 평균 매수가 (원)' })
  hoAveragePrice: string;

  @ApiProperty({
    example: '650623.45',
    description: '총 투자 금액 (원)',
  })
  hoTotalInvested: string;

  @ApiProperty({
    example: '첫 번째 XRP 매수',
    description: '메모',
    nullable: true,
  })
  hoMemo: string | null;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: '생성일',
  })
  createdAt: string;

  @ApiProperty({
    example: '2024-01-01T00:00:00.000Z',
    description: '수정일',
  })
  updatedAt: string;
}

export class XrpHoldingPaginatedResultDto {
  @ApiProperty({ example: null, description: '다음 커서 ID', nullable: true })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ type: [XrpHoldingDto], description: 'XRP 보유 목록' })
  list: XrpHoldingDto[];
}

export class XrpHoldingPaginatedResponseDto {
  @ApiProperty({ type: XrpHoldingPaginatedResultDto })
  result: XrpHoldingPaginatedResultDto;
}

export class XrpHoldingSummaryDto {
  @ApiProperty({ example: 5000.123456, description: '총 XRP 보유 수량' })
  totalQuantity: number;

  @ApiProperty({ example: 670.25, description: '전체 평균 매수가 (원)' })
  overallAveragePrice: number;

  @ApiProperty({
    example: 3351234.56,
    description: '총 투자 금액 (원)',
  })
  totalInvested: number;

  @ApiProperty({ example: 3, description: '보유 정보 개수' })
  holdingsCount: number;

  @ApiProperty({
    example: 680.5,
    description: '현재 XRP 가격 (원)',
    nullable: true,
  })
  currentPrice: number | null;

  @ApiProperty({
    example: 51250.89,
    description: '총 평가 손익 (원)',
    nullable: true,
  })
  totalProfitLoss: number | null;

  @ApiProperty({
    example: 1.53,
    description: '수익률 (%)',
    nullable: true,
  })
  profitLossRate: number | null;
}
