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

import { KeywordService } from 'src/keyword/keyword.service';
import { Admin } from 'src/auth/decorators/admin.decorator';
import { Keyword } from 'src/entities/keyword.entity';
import {
  CreateKeywordDto,
  UpdateKeywordDto,
} from 'src/keyword/dto/keyword.dto';

@ApiTags('관리자 - 키워드')
@Controller('admin/keyword')
@Admin()
@ApiBearerAuth()
export class KeywordAdminController {
  constructor(private readonly keywordService: KeywordService) {}

  @Get()
  @ApiOperation({ summary: '모든 키워드 조회 (관리자용)' })
  @ApiResponse({
    status: 200,
    description: '키워드 목록 조회 성공 (상세 정보 포함)',
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
    const keywords = await this.keywordService.getKeywordsForAdmin();
    return { data: keywords };
  }

  @Get('detail')
  @ApiOperation({ summary: '모든 키워드 상세 조회 (관리자용)' })
  @ApiResponse({
    status: 200,
    description: '키워드 상세 목록 조회 성공 (ID, 생성일 등 포함)',
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
              items: { $ref: '#/components/schemas/Keyword' },
            },
          },
        },
      },
    },
  })
  async getKeywordsDetailForAdmin(): Promise<{ data: Keyword[] }> {
    const keywords = await this.keywordService.getKeywordsDetailForAdmin();
    return { data: keywords };
  }

  @Post()
  @ApiOperation({ summary: '새 키워드 생성 (관리자용)' })
  @ApiResponse({
    status: 201,
    description: '키워드 생성 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 201 },
        message: {
          type: 'string',
          example: '요청이 성공적으로 처리되었습니다.',
        },
        result: {
          type: 'object',
          properties: {
            data: { $ref: '#/components/schemas/Keyword' },
          },
        },
      },
    },
  })
  async createKeyword(
    @Body() createKeywordDto: CreateKeywordDto,
  ): Promise<{ data: Keyword }> {
    const keyword = await this.keywordService.createKeyword(createKeywordDto);
    return { data: keyword };
  }

  @Put(':id')
  @ApiOperation({ summary: '키워드 수정 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '키워드 ID' })
  @ApiResponse({
    status: 200,
    description: '키워드 수정 성공',
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
            data: { $ref: '#/components/schemas/Keyword' },
          },
        },
      },
    },
  })
  async updateKeyword(
    @Param('id') id: number,
    @Body() updateKeywordDto: UpdateKeywordDto,
  ): Promise<{ data: Keyword }> {
    const keyword = await this.keywordService.updateKeyword(
      +id,
      updateKeywordDto,
    );
    return { data: keyword };
  }

  @Delete(':id')
  @ApiOperation({ summary: '키워드 삭제 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '키워드 ID' })
  @ApiResponse({
    status: 200,
    description: '키워드 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: '키워드가 삭제되었습니다.',
        },
      },
    },
  })
  async deleteKeyword(@Param('id') id: number): Promise<{ message: string }> {
    await this.keywordService.deleteKeyword(+id);
    return { message: '키워드가 삭제되었습니다.' };
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: '키워드 활성화/비활성화 토글 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '키워드 ID' })
  @ApiResponse({
    status: 200,
    description: '키워드 상태 변경 성공',
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
            data: { $ref: '#/components/schemas/Keyword' },
          },
        },
      },
    },
  })
  async toggleKeywordStatus(
    @Param('id') id: number,
  ): Promise<{ data: Keyword }> {
    const keyword = await this.keywordService.toggleKeywordStatus(+id);
    return { data: keyword };
  }

  @Post('bulk')
  @ApiOperation({
    summary: '키워드 일괄 생성/교체 (관리자용)',
    description:
      '기존 키워드를 모두 삭제하고 새로운 키워드 목록으로 일괄 교체합니다. 각 타입별로 키워드 배열을 전송하면, 해당 타입의 기존 키워드는 모두 삭제되고 새로운 키워드로 생성됩니다.',
  })
  @ApiResponse({
    status: 201,
    description: '키워드 일괄 생성/교체 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 201 },
        message: {
          type: 'string',
          example: '요청이 성공적으로 처리되었습니다.',
        },
        result: {
          type: 'object',
          properties: {
            data: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  keIdx: {
                    type: 'number',
                    example: 1,
                    description: '키워드 고유 식별자',
                  },
                  keKeyword: {
                    type: 'string',
                    example: '상승',
                    description: '키워드',
                  },
                  keWeight: {
                    type: 'string',
                    example: '1.5',
                    description: '가중치',
                  },
                  keType: {
                    type: 'string',
                    example: 'POSITIVE',
                    enum: ['POSITIVE', 'NEGATIVE', 'IMPORTANT'],
                  },
                  keIsActive: {
                    type: 'boolean',
                    example: true,
                    description: '활성 상태',
                  },
                  createdAt: { type: 'string', example: '2025-10-12 15:30:00' },
                  updatedAt: { type: 'string', example: '2025-10-12 15:30:00' },
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: '잘못된 요청 데이터',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'number', example: 400 },
        message: {
          type: 'string',
          example: 'keKeyword must be a string, keWeight must be a number',
        },
      },
    },
  })
  async bulkCreateKeywords(
    @Body()
    keywordsData: {
      positiveKeywords: { keKeyword: string; keWeight: number }[];
      negativeKeywords: { keKeyword: string; keWeight: number }[];
      importantKeywords: { keKeyword: string; keWeight: number }[];
    },
  ): Promise<{ data: Keyword[] }> {
    const result = await this.keywordService.bulkCreateKeywords(keywordsData);
    return { data: result };
  }
}
