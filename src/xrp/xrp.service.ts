import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { XrpHolding } from '../entities/xrp-holding.entity';
import { User } from '../entities/user.entity';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';
import {
  XrpHoldingDto,
  XrpHoldingPaginatedResultDto,
  XrpHoldingSummaryDto,
} from './dto/holding-response.dto';

@Injectable()
export class XrpService {
  constructor(
    @InjectRepository(XrpHolding)
    private holdingRepository: Repository<XrpHolding>,
  ) {}

  async createHolding(
    user: User,
    createHoldingDto: CreateHoldingDto,
  ): Promise<XrpHoldingDto> {
    const { quantity, averagePrice, memo } = createHoldingDto;

    const totalInvested = quantity * averagePrice;

    const holding = this.holdingRepository.create({
      user,
      quantity,
      averagePrice,
      totalInvested,
      memo,
    });

    const savedHolding = await this.holdingRepository.save(holding);

    return {
      id: savedHolding.id,
      quantity: savedHolding.quantity,
      averagePrice: savedHolding.averagePrice,
      totalInvested: savedHolding.totalInvested,
      memo: savedHolding.memo,
      createdAt: savedHolding.createdAt,
      updatedAt: savedHolding.updatedAt,
    };
  }

  async getHoldings(
    userId: number,
    page: number = 1,
    limit: number = 10,
  ): Promise<XrpHoldingPaginatedResultDto> {
    const offset = (page - 1) * limit;

    const [holdings, total] = await this.holdingRepository.findAndCount({
      where: { user: { id: userId } },
      order: { createdAt: 'DESC' },
      skip: offset,
      take: limit,
    });

    const lastPage = Math.ceil(total / limit);

    const list: XrpHoldingDto[] = holdings.map((holding) => ({
      id: holding.id,
      quantity: holding.quantity,
      averagePrice: holding.averagePrice,
      totalInvested: holding.totalInvested,
      memo: holding.memo,
      createdAt: holding.createdAt,
      updatedAt: holding.updatedAt,
    }));

    return {
      nextCursor: page < lastPage ? page + 1 : null,
      page: {
        total,
        perPage: limit,
        currentPage: page,
        lastPage,
      },
      list,
    };
  }

  async getHolding(userId: number, holdingId: number): Promise<XrpHoldingDto> {
    const holding = await this.holdingRepository.findOne({
      where: { id: holdingId, user: { id: userId } },
    });

    if (!holding) {
      throw new NotFoundException('보유 정보를 찾을 수 없습니다.');
    }

    return {
      id: holding.id,
      quantity: holding.quantity,
      averagePrice: holding.averagePrice,
      totalInvested: holding.totalInvested,
      memo: holding.memo,
      createdAt: holding.createdAt,
      updatedAt: holding.updatedAt,
    };
  }

  async updateHolding(
    userId: number,
    holdingId: number,
    updateHoldingDto: UpdateHoldingDto,
  ): Promise<XrpHoldingDto> {
    const holding = await this.holdingRepository.findOne({
      where: { id: holdingId, user: { id: userId } },
    });

    if (!holding) {
      throw new NotFoundException('보유 정보를 찾을 수 없습니다.');
    }

    // 업데이트할 필드들 적용
    if (updateHoldingDto.quantity !== undefined) {
      holding.quantity = updateHoldingDto.quantity;
    }
    if (updateHoldingDto.averagePrice !== undefined) {
      holding.averagePrice = updateHoldingDto.averagePrice;
    }
    if (updateHoldingDto.memo !== undefined) {
      holding.memo = updateHoldingDto.memo;
    }

    // 총 투자금액 재계산
    holding.totalInvested = holding.quantity * holding.averagePrice;

    const savedHolding = await this.holdingRepository.save(holding);

    return {
      id: savedHolding.id,
      quantity: savedHolding.quantity,
      averagePrice: savedHolding.averagePrice,
      totalInvested: savedHolding.totalInvested,
      memo: savedHolding.memo,
      createdAt: savedHolding.createdAt,
      updatedAt: savedHolding.updatedAt,
    };
  }

  async deleteHolding(userId: number, holdingId: number): Promise<void> {
    const holding = await this.holdingRepository.findOne({
      where: { id: holdingId, user: { id: userId } },
    });

    if (!holding) {
      throw new NotFoundException('보유 정보를 찾을 수 없습니다.');
    }

    await this.holdingRepository.remove(holding);
  }

  async getHoldingSummary(
    userId: number,
    currentXrpPrice?: number,
  ): Promise<XrpHoldingSummaryDto> {
    const holdings = await this.holdingRepository.find({
      where: { user: { id: userId } },
    });

    if (holdings.length === 0) {
      return {
        totalQuantity: 0,
        overallAveragePrice: 0,
        totalInvested: 0,
        holdingsCount: 0,
        currentPrice: currentXrpPrice || null,
        totalProfitLoss: null,
        profitLossRate: null,
      };
    }

    const totalQuantity = holdings.reduce((sum, h) => sum + h.quantity, 0);
    const totalInvested = holdings.reduce((sum, h) => sum + h.totalInvested, 0);
    const overallAveragePrice = totalInvested / totalQuantity;

    let totalProfitLoss: number | null = null;
    let profitLossRate: number | null = null;

    if (currentXrpPrice) {
      const currentValue = totalQuantity * currentXrpPrice;
      totalProfitLoss = currentValue - totalInvested;
      profitLossRate = (totalProfitLoss / totalInvested) * 100;
    }

    return {
      totalQuantity,
      overallAveragePrice,
      totalInvested,
      holdingsCount: holdings.length,
      currentPrice: currentXrpPrice || null,
      totalProfitLoss,
      profitLossRate,
    };
  }
}
