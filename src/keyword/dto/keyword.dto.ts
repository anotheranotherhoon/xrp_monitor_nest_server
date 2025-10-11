import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { KeywordType } from '../../entities/keyword.entity';

export class KeywordDto {
  @ApiProperty({ example: '상승', description: '키워드' })
  keyword: string;

  @ApiProperty({
    example: 1.5,
    description: '가중치 (0.1 ~ 10.0)',
    minimum: 0.1,
    maximum: 10.0,
  })
  weight: number;
}

export class CreateKeywordDto {
  @ApiProperty({ example: '상승', description: '키워드' })
  @IsString()
  keyword: string;

  @ApiProperty({
    example: 1.5,
    description: '가중치 (0.1 ~ 10.0)',
    minimum: 0.1,
    maximum: 10.0,
  })
  @IsNumber()
  @Min(0.1)
  @Max(10.0)
  weight: number;

  @ApiProperty({
    example: 'POSITIVE',
    description: '키워드 타입',
    enum: KeywordType,
  })
  @IsEnum(KeywordType)
  type: KeywordType;
}

export class UpdateKeywordDto {
  @ApiProperty({ example: '상승', description: '키워드', required: false })
  @IsOptional()
  @IsString()
  keyword?: string;

  @ApiProperty({
    example: 1.5,
    description: '가중치 (0.1 ~ 10.0)',
    minimum: 0.1,
    maximum: 10.0,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10.0)
  weight?: number;

  @ApiProperty({
    example: 'POSITIVE',
    description: '키워드 타입',
    enum: KeywordType,
    required: false,
  })
  @IsOptional()
  @IsEnum(KeywordType)
  type?: KeywordType;

  @ApiProperty({ example: true, description: '활성화 상태', required: false })
  @IsOptional()
  isActive?: boolean;
}

export class KeywordsResponseDto {
  @ApiProperty({
    type: [KeywordDto],
    description: '긍정적 키워드 목록',
  })
  positiveKeywords: KeywordDto[];

  @ApiProperty({
    type: [KeywordDto],
    description: '부정적 키워드 목록',
  })
  negativeKeywords: KeywordDto[];

  @ApiProperty({
    type: [KeywordDto],
    description: '중요 키워드 목록',
  })
  importantKeywords: KeywordDto[];
}
