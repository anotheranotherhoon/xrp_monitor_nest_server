import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';

import { XrpService } from './xrp.service';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';
import { XrpHoldingSummaryDto } from './dto/holding-response.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { User } from 'src/auth/decorators/user.decorator';
import { User as UserEntity } from 'src/entities/user.entity';

@ApiTags('💰 XRP 보유')
@Controller('xrp')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class XrpController {
  constructor(private readonly xrpService: XrpService) {}

  @Post('holding')
  @ApiOperation({ summary: 'XRP 보유 정보 생성/수정' })
  @ApiResponse({
    status: 201,
    description: 'XRP 보유 정보 생성/수정 성공',
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
              type: 'object',
              properties: {
                hoIdx: {
                  type: 'number',
                  example: 1,
                  description: '보유 정보 고유 식별자',
                },
                hoQuantity: {
                  type: 'string',
                  example: '1000.12345600',
                  description: 'XRP 보유 수량',
                },
                hoAveragePrice: {
                  type: 'string',
                  example: '650.50',
                  description: 'XRP 평균 매수가 (원)',
                },
                hoTotalInvested: {
                  type: 'string',
                  example: '650623.45',
                  description: '총 투자 금액 (원)',
                },
                hoMemo: {
                  type: 'string',
                  example: '첫 번째 XRP 매수',
                  description: '메모',
                  nullable: true,
                },
                createdAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                  description: '생성일',
                },
                updatedAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                  description: '수정일',
                },
              },
            },
          },
        },
      },
    },
  })
  async createOrUpdateHolding(
    @User() user: UserEntity,
    @Body() createHoldingDto: CreateHoldingDto,
  ) {
    const holding = await this.xrpService.createOrUpdateHolding(
      user,
      createHoldingDto,
    );
    return { data: holding };
  }

  @Get('holding')
  @ApiOperation({ summary: 'XRP 보유 정보 조회' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 조회 성공',
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
                hoIdx: {
                  type: 'number',
                  example: 1,
                  description: '보유 정보 고유 식별자',
                },
                hoQuantity: {
                  type: 'string',
                  example: '1000.12345600',
                  description: 'XRP 보유 수량',
                },
                hoAveragePrice: {
                  type: 'string',
                  example: '650.50',
                  description: 'XRP 평균 매수가 (원)',
                },
                hoTotalInvested: {
                  type: 'string',
                  example: '650623.45',
                  description: '총 투자 금액 (원)',
                },
                hoMemo: {
                  type: 'string',
                  example: '첫 번째 XRP 매수',
                  description: '메모',
                  nullable: true,
                },
                createdAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                  description: '생성일',
                },
                updatedAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                  description: '수정일',
                },
              },
              nullable: true,
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '보유 정보가 없음',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'number', example: 404 },
        message: { type: 'string', example: '보유 정보를 찾을 수 없습니다.' },
        result: {
          type: 'object',
          properties: { data: { type: 'null', example: null } },
        },
      },
    },
  })
  async getUserHolding(@User() user: UserEntity) {
    const holding = await this.xrpService.getUserHolding(user.meIdx);
    return { data: holding };
  }

  @Get('holding/summary')
  @ApiOperation({ summary: 'XRP 보유 요약 정보' })
  @ApiQuery({
    name: 'currentPrice',
    required: false,
    example: 680.5,
    description: '현재 XRP 가격 (손익 계산용)',
  })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 요약 정보 조회 성공',
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
                totalQuantity: {
                  type: 'number',
                  example: 5000.123456,
                  description: '총 XRP 보유 수량',
                },
                overallAveragePrice: {
                  type: 'number',
                  example: 670.25,
                  description: '전체 평균 매수가 (원)',
                },
                totalInvested: {
                  type: 'number',
                  example: 3351234.56,
                  description: '총 투자 금액 (원)',
                },
                holdingsCount: {
                  type: 'number',
                  example: 3,
                  description: '보유 정보 개수',
                },
                currentPrice: {
                  type: 'number',
                  example: 680.5,
                  description: '현재 XRP 가격 (원)',
                  nullable: true,
                },
                totalProfitLoss: {
                  type: 'number',
                  example: 51250.89,
                  description: '총 평가 손익 (원)',
                  nullable: true,
                },
                profitLossRate: {
                  type: 'number',
                  example: 1.53,
                  description: '수익률 (%)',
                  nullable: true,
                },
              },
            },
          },
        },
      },
    },
  })
  async getHoldingSummary(
    @User() user: UserEntity,
    @Query('currentPrice') currentPrice?: string,
  ): Promise<XrpHoldingSummaryDto> {
    const price = currentPrice ? parseFloat(currentPrice) : undefined;
    return this.xrpService.getHoldingSummary(user.meIdx, price);
  }

  @Put('holding')
  @ApiOperation({ summary: 'XRP 보유 정보 수정' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 수정 성공',
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
                hoIdx: {
                  type: 'number',
                  example: 1,
                  description: '보유 정보 고유 식별자',
                },
                hoQuantity: {
                  type: 'string',
                  example: '1500.65432100',
                  description: 'XRP 보유 수량',
                },
                hoAveragePrice: {
                  type: 'string',
                  example: '680.75',
                  description: 'XRP 평균 매수가 (원)',
                },
                hoTotalInvested: {
                  type: 'string',
                  example: '1021163.23',
                  description: '총 투자 금액 (원)',
                },
                hoMemo: {
                  type: 'string',
                  example: '추가 매수 후 평단가 조정',
                  description: '메모',
                  nullable: true,
                },
                createdAt: {
                  type: 'string',
                  example: '2024-01-01T00:00:00.000Z',
                  description: '생성일',
                },
                updatedAt: {
                  type: 'string',
                  example: '2024-01-01T12:00:00.000Z',
                  description: '수정일',
                },
              },
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '보유 정보를 찾을 수 없음',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'number', example: 404 },
        message: { type: 'string', example: '보유 정보를 찾을 수 없습니다.' },
      },
    },
  })
  async updateUserHolding(
    @User() user: UserEntity,
    @Body() updateHoldingDto: UpdateHoldingDto,
  ) {
    const holding = await this.xrpService.updateUserHolding(
      user.meIdx,
      updateHoldingDto,
    );
    return { data: holding };
  }

  @Delete('holding')
  @ApiOperation({ summary: 'XRP 보유 정보 삭제' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 삭제 성공',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 200 },
        message: { type: 'string', example: 'XRP 보유 정보가 삭제되었습니다.' },
      },
    },
  })
  @ApiResponse({
    status: 404,
    description: '보유 정보를 찾을 수 없음',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        code: { type: 'number', example: 404 },
        message: { type: 'string', example: '보유 정보를 찾을 수 없습니다.' },
      },
    },
  })
  async deleteUserHolding(@User() user: UserEntity): Promise<void> {
    await this.xrpService.deleteUserHolding(user.meIdx);
  }
}
