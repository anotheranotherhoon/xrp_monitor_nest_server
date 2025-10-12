import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Keyword, KeywordType } from '../entities/keyword.entity';
import {
  CreateKeywordDto,
  UpdateKeywordDto,
  KeywordsResponseDto,
  KeywordDto,
} from './dto/keyword.dto';

@Injectable()
export class KeywordService {
  constructor(
    @InjectRepository(Keyword)
    private keywordRepository: Repository<Keyword>,
  ) {}

  async getAllKeywords(): Promise<KeywordsResponseDto> {
    const keywords = await this.keywordRepository.find({
      where: { keIsActive: true },
      order: { keWeight: 'DESC' },
    });

    const positiveKeywords = keywords
      .filter((k) => k.keType === KeywordType.POSITIVE)
      .map((k) => ({
        keIdx: k.keIdx,
        keKeyword: k.keKeyword,
        keWeight: k.keWeight,
        keType: k.keType,
        keIsActive: k.keIsActive,
        createdAt: '',
        updatedAt: '',
      }));

    const negativeKeywords = keywords
      .filter((k) => k.keType === KeywordType.NEGATIVE)
      .map((k) => ({
        keIdx: k.keIdx,
        keKeyword: k.keKeyword,
        keWeight: k.keWeight,
        keType: k.keType,
        keIsActive: k.keIsActive,
        createdAt: '',
        updatedAt: '',
      }));

    const importantKeywords = keywords
      .filter((k) => k.keType === KeywordType.IMPORTANT)
      .map((k) => ({
        keIdx: k.keIdx,
        keKeyword: k.keKeyword,
        keWeight: k.keWeight,
        keType: k.keType,
        keIsActive: k.keIsActive,
        createdAt: '',
        updatedAt: '',
      }));

    return {
      positiveKeywords,
      negativeKeywords,
      importantKeywords,
    };
  }

  async getKeywordsByType(type: KeywordType): Promise<KeywordDto[]> {
    const keywords = await this.keywordRepository.find({
      where: { keType: type, keIsActive: true },
      order: { keWeight: 'DESC' },
    });

    return keywords.map((k) => ({
      keIdx: k.keIdx,
      keKeyword: k.keKeyword,
      keWeight: k.keWeight,
      keType: k.keType,
      keIsActive: k.keIsActive,
      createdAt: '',
      updatedAt: '',
    }));
  }

  async getKeywordsForAdmin(): Promise<{
    positiveKeywords: Keyword[];
    negativeKeywords: Keyword[];
    importantKeywords: Keyword[];
  }> {
    const keywords = await this.keywordRepository.find({
      order: { keType: 'ASC', keWeight: 'DESC' },
    });

    const positiveKeywords = keywords.filter(
      (k) => k.keType === KeywordType.POSITIVE,
    );
    const negativeKeywords = keywords.filter(
      (k) => k.keType === KeywordType.NEGATIVE,
    );
    const importantKeywords = keywords.filter(
      (k) => k.keType === KeywordType.IMPORTANT,
    );

    return {
      positiveKeywords,
      negativeKeywords,
      importantKeywords,
    };
  }

  async getKeywordsDetailForAdmin(): Promise<Keyword[]> {
    return this.keywordRepository.find({
      order: { keType: 'ASC', keWeight: 'DESC' },
    });
  }

  async createKeyword(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    // 중복 키워드 체크
    const existingKeyword = await this.keywordRepository.findOne({
      where: {
        keKeyword: createKeywordDto.keKeyword,
        keType: createKeywordDto.keType,
      },
    });

    if (existingKeyword) {
      throw new BadRequestException('이미 존재하는 키워드입니다.');
    }

    const keyword = this.keywordRepository.create(createKeywordDto);
    return this.keywordRepository.save(keyword);
  }

  async updateKeyword(
    id: number,
    updateKeywordDto: UpdateKeywordDto,
  ): Promise<Keyword> {
    const keyword = await this.keywordRepository.findOne({
      where: { keIdx: id },
    });

    if (!keyword) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.');
    }

    // 키워드와 타입이 변경되는 경우 중복 체크
    if (updateKeywordDto.keKeyword && updateKeywordDto.keType) {
      const existingKeyword = await this.keywordRepository.findOne({
        where: {
          keKeyword: updateKeywordDto.keKeyword,
          keType: updateKeywordDto.keType,
        },
      });

      if (existingKeyword && existingKeyword.keIdx !== id) {
        throw new BadRequestException('이미 존재하는 키워드입니다.');
      }
    }

    Object.assign(keyword, updateKeywordDto);
    return this.keywordRepository.save(keyword);
  }

  async deleteKeyword(id: number): Promise<void> {
    const keyword = await this.keywordRepository.findOne({
      where: { keIdx: id },
    });

    if (!keyword) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.');
    }

    await this.keywordRepository.remove(keyword);
  }

  async toggleKeywordStatus(id: number): Promise<Keyword> {
    const keyword = await this.keywordRepository.findOne({
      where: { keIdx: id },
    });

    if (!keyword) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.');
    }

    keyword.keIsActive = !keyword.keIsActive;
    return this.keywordRepository.save(keyword);
  }

  async bulkCreateKeywords(keywordsData: {
    positiveKeywords: { keKeyword: string; keWeight: number }[];
    negativeKeywords: { keKeyword: string; keWeight: number }[];
    importantKeywords: { keKeyword: string; keWeight: number }[];
  }): Promise<Keyword[]> {
    const keywords: Keyword[] = [];

    // 기존 키워드들 삭제
    await this.keywordRepository.clear();

    // 새로운 키워드들 생성
    for (const keywordData of keywordsData.positiveKeywords) {
      const keyword = this.keywordRepository.create({
        keKeyword: keywordData.keKeyword,
        keWeight: keywordData.keWeight,
        keType: KeywordType.POSITIVE,
      });
      keywords.push(keyword);
    }

    for (const keywordData of keywordsData.negativeKeywords) {
      const keyword = this.keywordRepository.create({
        keKeyword: keywordData.keKeyword,
        keWeight: keywordData.keWeight,
        keType: KeywordType.NEGATIVE,
      });
      keywords.push(keyword);
    }

    for (const keywordData of keywordsData.importantKeywords) {
      const keyword = this.keywordRepository.create({
        keKeyword: keywordData.keKeyword,
        keWeight: keywordData.keWeight,
        keType: KeywordType.IMPORTANT,
      });
      keywords.push(keyword);
    }

    return this.keywordRepository.save(keywords);
  }
}
