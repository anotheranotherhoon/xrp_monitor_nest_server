import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

export interface NaverNewsItem {
  title: string;
  originallink: string;
  link: string;
  description: string;
  pubDate: string;
}

export interface NaverNewsResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverNewsItem[];
}

@Injectable()
export class NewsService {
  private readonly naverApiPath = '/v1/search/news.json';

  constructor(private readonly httpService: HttpService) {}

  async getXrpNews(
    display: number = 10,
    sort: string = 'date',
    start: number = 1,
  ): Promise<NaverNewsResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(this.naverApiPath, {
          params: {
            query: 'XRP',
            display,
            sort,
            start,
          },
        }),
      );

      return response.data;
    } catch (error) {
      throw new HttpException(
        `네이버 뉴스 API 호출 중 오류가 발생했습니다: ${error.message}`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
