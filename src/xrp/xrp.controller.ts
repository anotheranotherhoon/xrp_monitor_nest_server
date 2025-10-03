import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
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
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { XrpService } from './xrp.service';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';
import {
  XrpHoldingDto,
  XrpHoldingPaginatedResponseDto,
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

  @Post('holdings')
  @ApiOperation({ summary: 'XRP 보유 정보 생성' })
  @ApiResponse({
    status: 201,
    description: 'XRP 보유 정보 생성 성공',
    type: XrpHoldingDto,
  })
  async createHolding(
    @User() user: UserEntity,
    @Body() createHoldingDto: CreateHoldingDto,
  ): Promise<XrpHoldingDto> {
    return this.xrpService.createHolding(user, createHoldingDto);
  }

  @Get('holdings')
  @ApiOperation({ summary: 'XRP 보유 정보 목록 조회' })
  @ApiQuery({
    name: 'page',
    required: false,
    example: 1,
    description: '페이지 번호',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    example: 10,
    description: '페이지당 항목 수',
  })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 목록 조회 성공',
    type: XrpHoldingPaginatedResponseDto,
  })
  async getHoldings(
    @User() user: UserEntity,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    const result = await this.xrpService.getHoldings(user.id, +page, +limit);
    return { result };
  }

  @Get('holdings/summary')
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

  @Get('holdings/:id')
  @ApiOperation({ summary: 'XRP 보유 정보 단일 조회' })
  @ApiParam({ name: 'id', example: 1, description: '보유 정보 ID' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 조회 성공',
    type: XrpHoldingDto,
  })
  @ApiResponse({ status: 404, description: '보유 정보를 찾을 수 없음' })
  async getHolding(
    @User() user: UserEntity,
    @Param('id') id: number,
  ): Promise<XrpHoldingDto> {
    return this.xrpService.getHolding(user.id, +id);
  }

  @Put('holdings/:id')
  @ApiOperation({ summary: 'XRP 보유 정보 수정' })
  @ApiParam({ name: 'id', example: 1, description: '보유 정보 ID' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 수정 성공',
    type: XrpHoldingDto,
  })
  @ApiResponse({ status: 404, description: '보유 정보를 찾을 수 없음' })
  async updateHolding(
    @User() user: UserEntity,
    @Param('id') id: number,
    @Body() updateHoldingDto: UpdateHoldingDto,
  ): Promise<XrpHoldingDto> {
    return this.xrpService.updateHolding(user.id, +id, updateHoldingDto);
  }

  @Delete('holdings/:id')
  @ApiOperation({ summary: 'XRP 보유 정보 삭제' })
  @ApiParam({ name: 'id', example: 1, description: '보유 정보 ID' })
  @ApiResponse({
    status: 200,
    description: 'XRP 보유 정보 삭제 성공',
  })
  @ApiResponse({ status: 404, description: '보유 정보를 찾을 수 없음' })
  async deleteHolding(
    @User() user: UserEntity,
    @Param('id') id: number,
  ): Promise<{ message: string }> {
    await this.xrpService.deleteHolding(user.id, +id);
    return { message: 'XRP 보유 정보가 삭제되었습니다.' };
  }
}
