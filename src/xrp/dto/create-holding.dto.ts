import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateHoldingDto {
  @ApiProperty({
    example: 1000.123456,
    description: 'XRP 보유 수량',
  })
  @IsNumber()
  @Min(0)
  quantity: number;

  @ApiProperty({
    example: 650.5,
    description: 'XRP 평균 매수가 (원)',
  })
  @IsNumber()
  @Min(0)
  averagePrice: number;

  @ApiProperty({
    example: '첫 번째 XRP 매수',
    description: '메모 (선택사항)',
    required: false,
  })
  @IsOptional()
  @IsString()
  memo?: string;
}
