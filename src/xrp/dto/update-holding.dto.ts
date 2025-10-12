import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpdateHoldingDto {
  @ApiProperty({
    example: 1500.654321,
    description: 'XRP 보유 수량',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hoQuantity?: number;

  @ApiProperty({
    example: 680.75,
    description: 'XRP 평균 매수가 (원)',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  hoAveragePrice?: number;

  @ApiProperty({
    example: '추가 매수 후 평단가 조정',
    description: '멤모',
    required: false,
  })
  @IsOptional()
  @IsString()
  hoMemo?: string;
}
