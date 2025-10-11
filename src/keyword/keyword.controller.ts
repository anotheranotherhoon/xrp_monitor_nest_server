import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';

import { KeywordService } from './keyword.service';
import { Admin } from '../auth/decorators/admin.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { Keyword, KeywordType } from '../entities/keyword.entity';
import {
  CreateKeywordDto,
  UpdateKeywordDto,
  KeywordsResponseDto,
  KeywordDto,
} from './dto/keyword.dto';

@ApiTags('🔑 키워드 관리')
@Controller('keyword')
export class KeywordController {
  constructor(private readonly keywordService: KeywordService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: '모든 키워드 조회 (사용자용)' })
  @ApiResponse({
    status: 200,
    description: '키워드 목록 조회 성공',
    type: KeywordsResponseDto,
  })
  async getAllKeywords(): Promise<{ data: KeywordsResponseDto }> {
    const data = await this.keywordService.getAllKeywords();
    return { data };
  }

  @Public()
  @Get('type/:type')
  @ApiOperation({ summary: '타입별 키워드 조회 (사용자용)' })
  @ApiParam({
    name: 'type',
    example: 'POSITIVE',
    description: '키워드 타입 (POSITIVE, NEGATIVE, IMPORTANT)',
    enum: KeywordType,
  })
  @ApiResponse({
    status: 200,
    description: '타입별 키워드 목록 조회 성공',
    type: [KeywordDto],
  })
  async getKeywordsByType(
    @Param('type') type: KeywordType,
  ): Promise<{ data: KeywordDto[] }> {
    const data = await this.keywordService.getKeywordsByType(type);
    return { data };
  }

  @Get('admin/all')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 키워드 조회 (관리자용)' })
  @ApiResponse({
    status: 200,
    description: '키워드 목록 조회 성공 (상세 정보 포함)',
    schema: {
      type: 'object',
      properties: {
        data: {
          type: 'object',
          properties: {
            positiveKeywords: {
              type: 'array',
              items: { $ref: '#/components/schemas/Keyword' },
            },
            negativeKeywords: {
              type: 'array',
              items: { $ref: '#/components/schemas/Keyword' },
            },
            importantKeywords: {
              type: 'array',
              items: { $ref: '#/components/schemas/Keyword' },
            },
          },
        },
      },
    },
  })
  async getKeywordsForAdmin(): Promise<{
    data: {
      positiveKeywords: Keyword[];
      negativeKeywords: Keyword[];
      importantKeywords: Keyword[];
    };
  }> {
    const data = await this.keywordService.getKeywordsForAdmin();
    return { data };
  }

  @Get('admin/detail')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '모든 키워드 상세 조회 (관리자용)' })
  @ApiResponse({
    status: 200,
    description: '키워드 상세 목록 조회 성공 (ID, 생성일 등 포함)',
    type: [Keyword],
  })
  async getKeywordsDetailForAdmin(): Promise<Keyword[]> {
    return this.keywordService.getKeywordsDetailForAdmin();
  }

  @Post('admin')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 키워드 생성 (관리자용)' })
  @ApiResponse({
    status: 201,
    description: '키워드 생성 성공',
    type: Keyword,
  })
  async createKeyword(
    @Body() createKeywordDto: CreateKeywordDto,
  ): Promise<Keyword> {
    return this.keywordService.createKeyword(createKeywordDto);
  }

  @Put('admin/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '키워드 수정 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '키워드 ID' })
  @ApiResponse({
    status: 200,
    description: '키워드 수정 성공',
    type: Keyword,
  })
  async updateKeyword(
    @Param('id') id: number,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ): Promise<Keyword> {
    return this.keywordService.updateKeyword(+id, updateKeywordDto);
  }

  @Delete('admin/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '키워드 삭제 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '키워드 ID' })
  @ApiResponse({
    status: 200,
    description: '키워드 삭제 성공',
  })
  async deleteKeyword(@Param('id') id: number): Promise<{ message: string }> {
    await this.keywordService.deleteKeyword(+id);
    return { message: '키워드가 삭제되었습니다.' };
  }

  @Put('admin/:id/toggle')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '키워드 활성화/비활성화 토글 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '키워드 ID' })
  @ApiResponse({
    status: 200,
    description: '키워드 상태 변경 성공',
    type: Keyword,
  })
  async toggleKeywordStatus(@Param('id') id: number): Promise<Keyword> {
    return this.keywordService.toggleKeywordStatus(+id);
  }

  @Post('admin/bulk')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({ summary: '키워드 일괄 생성 (관리자용)' })
  @ApiResponse({
    status: 201,
    description: '키워드 일괄 생성 성공',
    type: [Keyword],
  })
  async bulkCreateKeywords(
    @Body()
    keywordsData: {
      positiveKeywords: KeywordDto[];
      negativeKeywords: KeywordDto[];
      importantKeywords: KeywordDto[];
    },
  ): Promise<Keyword[]> {
    return this.keywordService.bulkCreateKeywords(keywordsData);
  }
}
