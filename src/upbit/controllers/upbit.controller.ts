import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  UpbitPaginatedResponseDto,
  UpbitPaginatedResultDto,
} from '../dto/upbit-paginated-response.dto';

@ApiTags('💹upbit')
@Controller('upbit')
export class UpbitController {
  @Get('socket-docs')
  @ApiOkResponse({
    type: UpbitPaginatedResponseDto,
    description: 'Upbit 실시간 소켓 문서',
  })
  getSocketDocs(): UpbitPaginatedResultDto {
    const socketDocs = {
      endpoint: 'ws(s)://<host>:<port>',
      transports: ['websocket'],
      events: [
        {
          name: 'subscribe-candles',
          description: '특정 마켓의 캔들을 구독합니다.',
          requestExample: { market: 'KRW-XRP', count: 200 },
          responseExample: {
            market: 'KRW-XRP',
            candles: [
              {
                market: 'KRW-XRP',
                candle_date_time_kst: '2025-01-01T00:00:00+09:00',
                candle_date_time_utc: '2024-12-31T15:00:00Z',
                opening_price: 900.1,
                high_price: 905.2,
                low_price: 890.5,
                trade_price: 901.3,
                timestamp: 1700000000000,
                candle_acc_trade_volume: 12345.678,
                candle_acc_trade_price: 123456789,
                unit: 1,
              },
            ],
            timestamp: '2025-01-01T00:00:00.000Z',
          },
        },
        {
          name: 'unsubscribe',
          description: '마켓 구독을 해제합니다.',
          requestExample: { market: 'KRW-XRP' },
        },
        {
          name: 'realtime-ticker',
          description:
            '구독 중인 마켓에 대한 실시간 현재가 이벤트(서버 → 클라이언트).',
          responseExample: {
            market: 'KRW-XRP',
            price: 901.3,
            change: 'RISE',
            changeRate: 0.0123,
            timestamp: 1700000000000,
            volume: 123456.78,
          },
        },
        {
          name: 'new-candle',
          description: '1분마다 최신 캔들 1개를 전달(서버 → 클라이언트).',
          responseExample: {
            market: 'KRW-XRP',
            candle: {
              market: 'KRW-XRP',
              candle_date_time_kst: '2025-01-01T00:01:00+09:00',
              candle_date_time_utc: '2024-12-31T15:01:00Z',
              opening_price: 900.1,
              high_price: 905.2,
              low_price: 890.5,
              trade_price: 901.3,
              timestamp: 1700000060000,
              candle_acc_trade_volume: 123.45,
              candle_acc_trade_price: 1234567,
              unit: 1,
            },
            timestamp: '2025-01-01T00:01:00.000Z',
          },
        },
        {
          name: 'server-status',
          description: '30초마다 서버 상태를 브로드캐스트(서버 → 클라이언트).',
          responseExample: {
            connectedClients: 1,
            timestamp: '2025-01-01T00:00:30.000Z',
            uptime: 123.456,
          },
        },
      ],
    };

    return {
      nextCursor: null,
      page: {
        total: 1,
        perPage: 1,
        currentPage: 1,
        lastPage: 1,
      },
      list: [socketDocs],
    };
  }
}
