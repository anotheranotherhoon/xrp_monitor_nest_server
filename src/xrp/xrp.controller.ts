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
import {
  XrpHoldingDto,
  XrpHoldingSummaryDto,
} from './dto/holding-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { User as UserEntity } from '../entities/user.entity';

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
    type: XrpHoldingDto,
  })
  async createOrUpdateHolding(
    @User() user: UserEntity,
    @Body() createHoldingDto: CreateHoldingDto,
  ): Promise<{ data: XrpHoldingDto }> {
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
    type: XrpHoldingDto,
  })
  @ApiResponse({ status: 404, description: '보유 정보가 없음' })
  async getUserHolding(
    @User() user: UserEntity,
  ): Promise<{ data: XrpHoldingDto | null }> {
    const holding = await this.xrpService.getUserHolding(user.id);
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
    type: XrpHoldingSummaryDto,
  })
  async getHoldingSummary(
    @User() user: UserEntity,
    @Query('currentPrice') currentPrice?: number,
  ): Promise<XrpHoldingSummaryDto> {
    return this.xrpService.getHoldingSummary(
      user.id,
      currentPrice ? +currentPrice : undefined,
    );
  }

  @Put('holding')
  @ApiOperation({ summary: 'XRP 보유 정보 수정' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 수정 성공',
    type: XrpHoldingDto,
  })
  @ApiResponse({ status: 404, description: '보유 정보를 찾을 수 없음' })
  async updateUserHolding(
    @User() user: UserEntity,
    @Body() updateHoldingDto: UpdateHoldingDto,
  ): Promise<XrpHoldingDto> {
    return this.xrpService.updateUserHolding(user.id, updateHoldingDto);
  }

  @Delete('holding')
  @ApiOperation({ summary: 'XRP 보유 정보 삭제' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 삭제 성공',
  })
  @ApiResponse({ status: 404, description: '보유 정보를 찾을 수 없음' })
  async deleteUserHolding(
    @User() user: UserEntity,
  ): Promise<{ message: string }> {
    await this.xrpService.deleteUserHolding(user.id);
    return { message: 'XRP 보유 정보가 삭제되었습니다.' };
  }
}
