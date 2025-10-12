import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsBoolean,
  Min,
  Max,
} from 'class-validator';
import { KeywordType } from '../../entities/keyword.entity';

export class KeywordDto {
  @ApiProperty({
    example: 1,
    description: '키워드 고유 식별자',
    type: 'integer',
  })
  @IsNumber()
  keIdx: number;

  @ApiProperty({
    example: '상승',
    description: '키워드 모니터링에 사용될 키워드 문자열',
    type: 'string',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  keKeyword: string;

  @ApiProperty({
    example: 1.5,
    description: '키워드의 감정 분석 가중치 (양수: 긍정, 음수: 부정)',
    type: 'number',
    minimum: 0.1,
    maximum: 10.0,
    format: 'decimal',
  })
  @IsNumber()
  @Min(0.1)
  @Max(10.0)
  keWeight: number;

  @ApiProperty({
    example: KeywordType.POSITIVE,
    description:
      '키워드 분류 타입 - POSITIVE: 긍정적 키워드, NEGATIVE: 부정적 키워드, IMPORTANT: 중요 키워드',
    enum: KeywordType,
    enumName: 'KeywordType',
  })
  @IsEnum(KeywordType)
  keType: KeywordType;

  @ApiProperty({
    example: true,
    description: '키워드 활성화 상태 - true: 활성, false: 비활성',
    type: 'boolean',
    default: true,
  })
  @IsBoolean()
  keIsActive: boolean;

  @ApiProperty({
    example: '2025-10-12 15:30:00',
    description: '키워드 생성 일시 (한국시간 KST)',
    type: 'string',
    format: 'date-time',
  })
  createdAt: string;

  @ApiProperty({
    example: '2025-10-12 15:30:00',
    description: '키워드 최종 수정 일시 (한국시간 KST)',
    type: 'string',
    format: 'date-time',
  })
  updatedAt: string;
}

export class CreateKeywordDto {
  @ApiProperty({
    example: '상승',
    description: '생성할 키워드 문자열 - 모니터링에 사용될 단어나 구문',
    type: 'string',
    minLength: 1,
    maxLength: 50,
  })
  @IsString()
  keKeyword: string;

  @ApiProperty({
    example: 1.5,
    description:
      '감정 분석 가중치 - 양수일수록 긍정적, 수치가 클수록 영향력이 큰 키워드',
    type: 'number',
    minimum: 0.1,
    maximum: 10.0,
    format: 'decimal',
  })
  @IsNumber()
  @Min(0.1)
  @Max(10.0)
  keWeight: number;

  @ApiProperty({
    example: KeywordType.POSITIVE,
    description: '키워드 분류 타입 선택',
    enum: KeywordType,
    enumName: 'KeywordType',
  })
  @IsEnum(KeywordType)
  keType: KeywordType;
}

export class UpdateKeywordDto {
  @ApiProperty({
    example: '급등',
    description: '수정할 키워드 문자열 - 선택사항',
    type: 'string',
    minLength: 1,
    maxLength: 50,
    required: false,
  })
  @IsOptional()
  @IsString()
  keKeyword?: string;

  @ApiProperty({
    example: 2.0,
    description: '수정할 감정 분석 가중치 - 선택사항',
    type: 'number',
    minimum: 0.1,
    maximum: 10.0,
    format: 'decimal',
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Min(0.1)
  @Max(10.0)
  keWeight?: number;

  @ApiProperty({
    example: KeywordType.IMPORTANT,
    description: '수정할 키워드 분류 타입 - 선택사항',
    enum: KeywordType,
    enumName: 'KeywordType',
    required: false,
  })
  @IsOptional()
  @IsEnum(KeywordType)
  keType?: KeywordType;

  @ApiProperty({
    example: false,
    description: '수정할 활성화 상태 - true: 활성, false: 비활성 - 선택사항',
    type: 'boolean',
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  keIsActive?: boolean;
}

export class KeywordsResponseDto {
  @ApiProperty({
    type: [KeywordDto],
    description:
      '긍정적 감정을 나타내는 키워드 목록 - 가격 상승, 좋은 뉴스 등에 사용',
    example: [
      {
        keIdx: 1,
        keKeyword: '상승',
        keWeight: 1.5,
        keType: 'POSITIVE',
        keIsActive: true,
        createdAt: '2025-10-12 15:30:00',
        updatedAt: '2025-10-12 15:30:00',
      },
    ],
  })
  positiveKeywords: KeywordDto[];

  @ApiProperty({
    type: [KeywordDto],
    description:
      '부정적 감정을 나타내는 키워드 목록 - 가격 하락, 나쁨 뉴스 등에 사용',
    example: [
      {
        keIdx: 2,
        keKeyword: '하락',
        keWeight: -1.2,
        keType: 'NEGATIVE',
        keIsActive: true,
        createdAt: '2025-10-12 15:30:00',
        updatedAt: '2025-10-12 15:30:00',
      },
    ],
  })
  negativeKeywords: KeywordDto[];

  @ApiProperty({
    type: [KeywordDto],
    description:
      '중요한 이슈나 이벤트를 나타내는 키워드 목록 - 중요 발표, 규제 등에 사용',
    example: [
      {
        keIdx: 3,
        keKeyword: 'SEC',
        keWeight: 3.0,
        keType: 'IMPORTANT',
        keIsActive: true,
        createdAt: '2025-10-12 15:30:00',
        updatedAt: '2025-10-12 15:30:00',
      },
    ],
  })
  importantKeywords: KeywordDto[];
}

// 키워드 목록 응답 DTO
export class KeywordListResponseDto {
  @ApiProperty({
    type: [KeywordDto],
    description:
      '관리자용 키워드 전체 목록 - 활성/비활성 상태와 상세 정보 포함',
    example: [
      {
        keIdx: 1,
        keKeyword: '상승',
        keWeight: 1.5,
        keType: 'POSITIVE',
        keIsActive: true,
        createdAt: '2025-10-12 15:30:00',
        updatedAt: '2025-10-12 15:30:00',
      },
    ],
  })
  list: KeywordDto[];
}

// 벌크 생성 DTO
export class BulkCreateKeywordDto {
  @ApiProperty({
    type: [KeywordDto],
    description:
      '긍정적 키워드 목록 - 기존 데이터를 모두 삭제하고 새로 생성됩니다',
    example: [
      { keKeyword: '상승', keWeight: 1.5 },
      { keKeyword: '급등', keWeight: 2.0 },
    ],
  })
  positiveKeywords: KeywordDto[];

  @ApiProperty({
    type: [KeywordDto],
    description:
      '부정적 키워드 목록 - 기존 데이터를 모두 삭제하고 새로 생성됩니다',
    example: [
      { keKeyword: '하락', keWeight: -1.2 },
      { keKeyword: '급락', keWeight: -2.0 },
    ],
  })
  negativeKeywords: KeywordDto[];

  @ApiProperty({
    type: [KeywordDto],
    description:
      '중요 키워드 목록 - 기존 데이터를 모두 삭제하고 새로 생성됩니다',
    example: [
      { keKeyword: 'SEC', keWeight: 3.0 },
      { keKeyword: '규제', keWeight: 2.5 },
    ],
  })
  importantKeywords: KeywordDto[];
}
