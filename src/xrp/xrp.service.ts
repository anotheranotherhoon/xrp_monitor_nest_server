import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { XrpHolding } from 'src/entities/xrp-holding.entity';
import { User } from 'src/entities/user.entity';
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
    const { hoQuantity, hoAveragePrice, hoMemo } = createHoldingDto;

    const totalInvested = hoQuantity * hoAveragePrice;

    // 기존 보유정보가 있는지 확인
    let holding = await this.holdingRepository.findOne({
      where: { user: { meIdx: user.meIdx } },
    });

    if (holding) {
      // 기존 보유정보 업데이트
      holding.hoQuantity = hoQuantity;
      holding.hoAveragePrice = hoAveragePrice;
      holding.hoTotalInvested = totalInvested;
      holding.hoMemo = hoMemo;
    } else {
      // 새 보유정보 생성
      holding = this.holdingRepository.create({
        user,
        hoQuantity,
        hoAveragePrice,
        hoTotalInvested: totalInvested,
        hoMemo,
      });
    }

    const savedHolding = await this.holdingRepository.save(holding);

    return {
      hoIdx: savedHolding.hoIdx,
      hoQuantity: savedHolding.hoQuantity.toString(),
      hoAveragePrice: savedHolding.hoAveragePrice.toString(),
      hoTotalInvested: savedHolding.hoTotalInvested.toString(),
      hoMemo: savedHolding.hoMemo,
      createdAt: savedHolding.createdAt.toISOString(),
      updatedAt: savedHolding.updatedAt.toISOString(),
    };
  }

  async getUserHolding(userId: number): Promise<XrpHoldingDto | null> {
    const holding = await this.holdingRepository.findOne({
      where: { user: { meIdx: userId } },
    });

    if (!holding) {
      return null;
    }

    return {
      hoIdx: holding.hoIdx,
      hoQuantity: holding.hoQuantity.toString(),
      hoAveragePrice: holding.hoAveragePrice.toString(),
      hoTotalInvested: holding.hoTotalInvested.toString(),
      hoMemo: holding.hoMemo,
      createdAt: holding.createdAt.toISOString(),
      updatedAt: holding.updatedAt.toISOString(),
    };
  }

  async updateUserHolding(
    userId: number,
    updateHoldingDto: UpdateHoldingDto,
  ): Promise<XrpHoldingDto> {
    const holding = await this.holdingRepository.findOne({
      where: { user: { meIdx: userId } },
    });

    if (!holding) {
      throw new NotFoundException('보유 정보를 찾을 수 없습니다.');
    }

    // 업데이트할 필드들 적용
    if (updateHoldingDto.hoQuantity !== undefined) {
      holding.hoQuantity = updateHoldingDto.hoQuantity;
    }
    if (updateHoldingDto.hoAveragePrice !== undefined) {
      holding.hoAveragePrice = updateHoldingDto.hoAveragePrice;
    }
    if (updateHoldingDto.hoMemo !== undefined) {
      holding.hoMemo = updateHoldingDto.hoMemo;
    }

    // 총 투자금액 재계산
    holding.hoTotalInvested = holding.hoQuantity * holding.hoAveragePrice;

    const savedHolding = await this.holdingRepository.save(holding);

    return {
      hoIdx: savedHolding.hoIdx,
      hoQuantity: savedHolding.hoQuantity.toString(),
      hoAveragePrice: savedHolding.hoAveragePrice.toString(),
      hoTotalInvested: savedHolding.hoTotalInvested.toString(),
      hoMemo: savedHolding.hoMemo,
      createdAt: savedHolding.createdAt.toISOString(),
      updatedAt: savedHolding.updatedAt.toISOString(),
    };
  }

  async deleteUserHolding(userId: number): Promise<void> {
    const holding = await this.holdingRepository.findOne({
      where: { user: { meIdx: userId } },
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
      where: { user: { meIdx: userId } },
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
      const currentValue = holding.hoQuantity * currentXrpPrice;
      totalProfitLoss = currentValue - holding.hoTotalInvested;
      profitLossRate = (totalProfitLoss / holding.hoTotalInvested) * 100;
    }

    return {
      totalQuantity: holding.hoQuantity,
      overallAveragePrice: holding.hoAveragePrice,
      totalInvested: holding.hoTotalInvested,
      holdingsCount: 1,
      currentPrice: currentXrpPrice || null,
      totalProfitLoss,
      profitLossRate,
    };
  }
}
