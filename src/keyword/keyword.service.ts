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
      where: { isActive: true },
      order: { weight: 'DESC' },
    });

    const positiveKeywords = keywords
      .filter((k) => k.type === KeywordType.POSITIVE)
      .map((k) => ({ keyword: k.keyword, weight: k.weight }));

    const negativeKeywords = keywords
      .filter((k) => k.type === KeywordType.NEGATIVE)
      .map((k) => ({ keyword: k.keyword, weight: k.weight }));

    const importantKeywords = keywords
      .filter((k) => k.type === KeywordType.IMPORTANT)
      .map((k) => ({ keyword: k.keyword, weight: k.weight }));

    return {
      positiveKeywords,
      negativeKeywords,
      importantKeywords,
    };
  }

  async getKeywordsByType(type: KeywordType): Promise<KeywordDto[]> {
    const keywords = await this.keywordRepository.find({
      where: { type, isActive: true },
      order: { weight: 'DESC' },
    });

    return keywords.map((k) => ({ keyword: k.keyword, weight: k.weight }));
  }

  async getKeywordsForAdmin(): Promise<{
    positiveKeywords: Keyword[];
    negativeKeywords: Keyword[];
    importantKeywords: Keyword[];
  }> {
    const keywords = await this.keywordRepository.find({
      order: { type: 'ASC', weight: 'DESC' },
    });

    const positiveKeywords = keywords.filter(
      (k) => k.type === KeywordType.POSITIVE,
    );
    const negativeKeywords = keywords.filter(
      (k) => k.type === KeywordType.NEGATIVE,
    );
    const importantKeywords = keywords.filter(
      (k) => k.type === KeywordType.IMPORTANT,
    );

    return {
      positiveKeywords,
      negativeKeywords,
      importantKeywords,
    };
  }

  async getKeywordsDetailForAdmin(): Promise<Keyword[]> {
    return this.keywordRepository.find({
      order: { type: 'ASC', weight: 'DESC' },
    });
  }

  async createKeyword(createKeywordDto: CreateKeywordDto): Promise<Keyword> {
    // 중복 키워드 체크
    const existingKeyword = await this.keywordRepository.findOne({
      where: {
        keyword: createKeywordDto.keyword,
        type: createKeywordDto.type,
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
      where: { id },
    });

    if (!keyword) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.');
    }

    // 키워드와 타입이 변경되는 경우 중복 체크
    if (updateKeywordDto.keyword && updateKeywordDto.type) {
      const existingKeyword = await this.keywordRepository.findOne({
        where: {
          keyword: updateKeywordDto.keyword,
          type: updateKeywordDto.type,
        },
      });

      if (existingKeyword && existingKeyword.id !== id) {
        throw new BadRequestException('이미 존재하는 키워드입니다.');
      }
    }

    Object.assign(keyword, updateKeywordDto);
    return this.keywordRepository.save(keyword);
  }

  async deleteKeyword(id: number): Promise<void> {
    const keyword = await this.keywordRepository.findOne({
      where: { id },
    });

    if (!keyword) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.');
    }

    await this.keywordRepository.remove(keyword);
  }

  async toggleKeywordStatus(id: number): Promise<Keyword> {
    const keyword = await this.keywordRepository.findOne({
      where: { id },
    });

    if (!keyword) {
      throw new NotFoundException('키워드를 찾을 수 없습니다.');
    }

    keyword.isActive = !keyword.isActive;
    return this.keywordRepository.save(keyword);
  }

  async bulkCreateKeywords(keywordsData: {
    positiveKeywords: KeywordDto[];
    negativeKeywords: KeywordDto[];
    importantKeywords: KeywordDto[];
  }): Promise<Keyword[]> {
    const keywords: Keyword[] = [];

    // 기존 키워드들 삭제
    await this.keywordRepository.clear();

    // 새로운 키워드들 생성
    for (const keywordData of keywordsData.positiveKeywords) {
      const keyword = this.keywordRepository.create({
        ...keywordData,
        type: KeywordType.POSITIVE,
      });
      keywords.push(keyword);
    }

    for (const keywordData of keywordsData.negativeKeywords) {
      const keyword = this.keywordRepository.create({
        ...keywordData,
        type: KeywordType.NEGATIVE,
      });
      keywords.push(keyword);
    }

    for (const keywordData of keywordsData.importantKeywords) {
      const keyword = this.keywordRepository.create({
        ...keywordData,
        type: KeywordType.IMPORTANT,
      });
      keywords.push(keyword);
    }

    return this.keywordRepository.save(keywords);
  }
}
