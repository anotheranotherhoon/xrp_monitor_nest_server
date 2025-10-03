import { ApiProperty } from '@nestjs/swagger';

export class UpbitSocketEventDto {
  @ApiProperty({ example: 'subscribe-candles' })
  name: string;

  @ApiProperty({
    example: '클라이언트가 특정 마켓의 캔들 데이터를 구독합니다.',
  })
  description: string;

  @ApiProperty({
    example: { market: 'KRW-XRP', count: 200 },
    description: '클라이언트 → 서버 전송 예시 페이로드',
    required: false,
  })
  requestExample?: Record<string, any>;

  @ApiProperty({
    example: {
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
    description: '서버 → 클라이언트 전송 예시 페이로드',
    required: false,
  })
  responseExample?: Record<string, any>;
}

export class UpbitSocketDocsDto {
  @ApiProperty({ example: 'ws(s)://<host>:<port>' })
  endpoint: string;

  @ApiProperty({ isArray: true, type: String })
  transports: string[];

  @ApiProperty({ isArray: true, type: UpbitSocketEventDto })
  events: UpbitSocketEventDto[];
}
