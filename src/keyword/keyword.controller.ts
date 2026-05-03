import { Controller, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { KeywordService } from 'src/keyword/keyword.service';
import { Public } from 'src/auth/decorators/public.decorator';
import { KeywordType } from 'src/entities/keyword.entity';
import { KeywordsResponseDto, KeywordDto } from 'src/keyword/dto/keyword.dto';

@ApiTags('키워드')
@Controller('keyword')
@Public()
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Get()
  @ApiOperation({ summary: '모든 키워드 조회' })
  @ApiResponse({
    status: 200,
    description: '키워드 목록 조회 성공',
    type: KeywordsResponseDto,
  })
  async getAllKeywords(): Promise<{
    data: {
      positiveKeywords: Array<{
        keIdx: number;
        keKeyword: string;
        keWeight: number;
        keType: KeywordType;
      }>;
      negativeKeywords: Array<{
        keIdx: number;
        keKeyword: string;
        keWeight: number;
        keType: KeywordType;
      }>;
      importantKeywords: Array<{
        keIdx: number;
        keKeyword: string;
        keWeight: number;
        keType: KeywordType;
      }>;
    };
  }> {
    const keywords = await this.keywordService.getAllKeywords();
    return { data: keywords };
  }

  @Get('type/:type')
  @ApiOperation({ summary: '타입별 키워드 조회' })
  @ApiParam({
    name: 'type',
    example: 'POSITIVE',
    description: '키워드 타입 (POSITIVE, NEGATIVE, IMPORTANT)',
    enum: KeywordType,
  })
  @ApiResponse({
    status: 200,
    description: '타입별 키워드 목록 조회 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: '요청이 성공적으로 처리되었습니다.',
        },
        result: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: { $ref: '#/components/schemas/KeywordDto' },
            },
          },
        },
      },
    },
  })
  async getKeywordsByType(
    @Param('type') type: KeywordType,
  ): Promise<{ data: KeywordDto[] }> {
    const keywords = await this.keywordService.getKeywordsByType(type);
    return { data: keywords };
  }
}
