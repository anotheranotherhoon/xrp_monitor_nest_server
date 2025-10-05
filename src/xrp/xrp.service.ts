import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { XrpHolding } from '../entities/xrp-holding.entity';
import { User } from '../entities/user.entity';
import { CreateHoldingDto } from './dto/create-holding.dto';
import { UpdateHoldingDto } from './dto/update-holding.dto';
import {
  XrpHoldingDto,
  XrpHoldingSummaryDto,
} from './dto/holding-response.dto';

@Injectable()
export class XrpService {
  constructor(
    @InjectRepository(XrpHolding)
    private holdingRepository: Repository<XrpHolding>,
  ) {}

  async createOrUpdateHolding(
    user: User,
    createHoldingDto: CreateHoldingDto,
  ): Promise<XrpHoldingDto> {
    const { quantity, averagePrice, memo } = createHoldingDto;

    const totalInvested = quantity * averagePrice;

    // 기존 보유정보가 있는지 확인
    let holding = await this.holdingRepository.findOne({
      where: { user: { id: user.id } },
    });

    if (holding) {
      // 기존 보유정보 업데이트
      holding.quantity = quantity;
      holding.averagePrice = averagePrice;
      holding.totalInvested = totalInvested;
      holding.memo = memo;
    } else {
      // 새 보유정보 생성
      holding = this.holdingRepository.create({
        user,
        quantity,
        averagePrice,
        totalInvested,
        memo,
      });
    }

    const savedHolding = await this.holdingRepository.save(holding);

    return {
      id: savedHolding.id,
      quantity: savedHolding.quantity.toString(),
      averagePrice: savedHolding.averagePrice.toString(),
      totalInvested: savedHolding.totalInvested.toString(),
      memo: savedHolding.memo,
      createdAt: savedHolding.createdAt.toISOString(),
      updatedAt: savedHolding.updatedAt.toISOString(),
    };
  }

  async getUserHolding(userId: number): Promise<XrpHoldingDto | null> {
    const holding = await this.holdingRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!holding) {
      return null;
    }

    return {
      id: holding.id,
      quantity: holding.quantity.toString(),
      averagePrice: holding.averagePrice.toString(),
      totalInvested: holding.totalInvested.toString(),
      memo: holding.memo,
      createdAt: holding.createdAt.toISOString(),
      updatedAt: holding.updatedAt.toISOString(),
    };
  }

  async updateUserHolding(
    userId: number,
    updateHoldingDto: UpdateHoldingDto,
  ): Promise<XrpHoldingDto> {
    const holding = await this.holdingRepository.findOne({
      where: { user: { id: userId } },
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
      quantity: savedHolding.quantity.toString(),
      averagePrice: savedHolding.averagePrice.toString(),
      totalInvested: savedHolding.totalInvested.toString(),
      memo: savedHolding.memo,
      createdAt: savedHolding.createdAt.toISOString(),
      updatedAt: savedHolding.updatedAt.toISOString(),
    };
  }

  async deleteUserHolding(userId: number): Promise<void> {
    const holding = await this.holdingRepository.findOne({
      where: { user: { id: userId } },
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
    const holding = await this.holdingRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!holding) {
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

    let totalProfitLoss: number | null = null;
    let profitLossRate: number | null = null;

    if (currentXrpPrice) {
      const currentValue = holding.quantity * currentXrpPrice;
      totalProfitLoss = currentValue - holding.totalInvested;
      profitLossRate = (totalProfitLoss / holding.totalInvested) * 100;
    }

    return {
      totalQuantity: holding.quantity,
      overallAveragePrice: holding.averagePrice,
      totalInvested: holding.totalInvested,
      holdingsCount: 1,
      currentPrice: currentXrpPrice || null,
      totalProfitLoss,
      profitLossRate,
    };
  }
}
