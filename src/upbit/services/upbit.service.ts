import { Injectable, Logger } from '@nestjs/common';
import axios from 'axios';
import * as WebSocket from 'ws';
import { Cron } from '@nestjs/schedule';

export interface CandleData {
  market: string;
  candle_date_time_kst: string;
  candle_date_time_utc: string;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  timestamp: number;
  candle_acc_trade_volume: number;
  candle_acc_trade_price: number;
  unit: number;
}

export interface TickerData {
  market: string;
  trade_date: string;
  trade_time: string;
  trade_date_kst: string;
  trade_time_kst: string;
  trade_timestamp: number;
  opening_price: number;
  high_price: number;
  low_price: number;
  trade_price: number;
  prev_closing_price: number;
  change: 'EVEN' | 'RISE' | 'FALL';
  change_price: number;
  change_rate: number;
  signed_change_price: number;
  signed_change_rate: number;
  trade_volume: number;
  acc_trade_price: number;
  acc_trade_price_24h: number;
  acc_trade_volume: number;
  acc_trade_volume_24h: number;
  highest_52_week_price: number;
  highest_52_week_date: string;
  lowest_52_week_price: number;
  lowest_52_week_date: string;
  timestamp: number;
}

@Injectable()
export class UpbitService {
  private readonly logger = new Logger(UpbitService.name);
  private upbitWebSocket: WebSocket;
  private onDataCallback: (data: TickerData) => void;

  constructor() {
    this.connectToUpbit();
  }

  async getInitialCandles(
    market: string,
    count: number = 200,
  ): Promise<CandleData[]> {
    try {
      const response = await axios.get(
        `https://api.upbit.com/v1/candles/minutes/1`,
        {
          params: { market, count },
          headers: { Accept: 'application/json' },
        },
      );
      this.logger.log(
        `Initial candles loaded: ${response.data.length} items for ${market}`,
      );
      return response.data.reverse();
    } catch (error: any) {
      this.logger.error('Failed to fetch initial candles:', error?.message);
      throw error;
    }
  }

  async getLatestCandle(market: string): Promise<CandleData> {
    try {
      const response = await axios.get(
        `https://api.upbit.com/v1/candles/minutes/1`,
        {
          params: { market, count: 1 },
          headers: { Accept: 'application/json' },
        },
      );
      return response.data[0];
    } catch (error: any) {
      this.logger.error('Failed to fetch latest candle:', error?.message);
      throw error;
    }
  }

  private connectToUpbit() {
    this.upbitWebSocket = new WebSocket('wss://api.upbit.com/websocket/v1');

    this.upbitWebSocket.on('open', () => {
      this.logger.log('Connected to Upbit WebSocket');
      const subscribeMessage = [
        { ticket: 'upbit-realtime' },
        { type: 'ticker', codes: ['KRW-XRP', 'KRW-BTC', 'KRW-ETH'] },
        { format: 'SIMPLE' },
      ];
      this.upbitWebSocket.send(JSON.stringify(subscribeMessage));
    });

    this.upbitWebSocket.on('message', (data) => {
      try {
        const tickerData = JSON.parse(data.toString()) as TickerData;
        if (this.onDataCallback) this.onDataCallback(tickerData);
      } catch (error: any) {
        this.logger.error('Error parsing WebSocket message:', error?.message);
      }
    });

    this.upbitWebSocket.on('close', () => {
      this.logger.warn('Upbit WebSocket disconnected. Reconnecting...');
      setTimeout(() => this.connectToUpbit(), 5000);
    });

    this.upbitWebSocket.on('error', (error) => {
      this.logger.error('Upbit WebSocket error:', (error as any)?.message);
    });
  }

  onRealtimeData(callback: (data: TickerData) => void) {
    this.onDataCallback = callback;
  }

  disconnect() {
    if (this.upbitWebSocket) this.upbitWebSocket.close();
  }

  @Cron('0 * * * * *')
  async handleNewCandleCron() {
    // Placeholder for injection via gateway
  }
}
