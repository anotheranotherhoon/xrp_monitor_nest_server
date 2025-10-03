import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { Cron } from '@nestjs/schedule';
import {
  UpbitService,
  CandleData,
  TickerData,
} from '../services/upbit.service';

interface ClientData {
  subscribedMarkets: Set<string>;
  candleData: Map<string, CandleData[]>;
}

@WebSocketGateway({
  cors: { origin: '*', methods: ['GET', 'POST'] },
  transports: ['websocket'],
})
export class UpbitGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(UpbitGateway.name);
  private clientData = new Map<string, ClientData>();

  constructor(private readonly upbitService: UpbitService) {
    this.upbitService.onRealtimeData((tickerData: TickerData) => {
      this.handleRealtimeTicker(tickerData);
    });
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
    this.clientData.set(client.id, {
      subscribedMarkets: new Set(),
      candleData: new Map(),
    });
    client.emit('connection-success', {
      message: 'Connected to Upbit WebSocket Server',
      timestamp: new Date().toISOString(),
    });
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.clientData.delete(client.id);
  }

  @SubscribeMessage('subscribe-candles')
  async handleSubscribeCandles(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { market: string; count?: number },
  ) {
    try {
      const { market, count = 200 } = data;
      this.logger.log(`Client ${client.id} subscribing to ${market} candles`);

      const clientInfo = this.clientData.get(client.id);
      if (clientInfo) clientInfo.subscribedMarkets.add(market);

      const initialCandles = await this.upbitService.getInitialCandles(
        market,
        count,
      );
      if (clientInfo) clientInfo.candleData.set(market, initialCandles);

      client.emit('initial-candles', {
        market,
        candles: initialCandles,
        timestamp: new Date().toISOString(),
      });
    } catch (error: any) {
      this.logger.error(
        `Error subscribing candles for ${client.id}:`,
        error?.message,
      );
      client.emit('error', {
        message: 'Failed to subscribe candles',
        error: error?.message,
      });
    }
  }

  @SubscribeMessage('unsubscribe')
  handleUnsubscribe(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { market: string },
  ) {
    const clientInfo = this.clientData.get(client.id);
    if (clientInfo) {
      clientInfo.subscribedMarkets.delete(data.market);
      clientInfo.candleData.delete(data.market);
    }
  }

  private handleRealtimeTicker(tickerData: TickerData) {
    const { market } = tickerData;
    this.clientData.forEach((clientInfo, clientId) => {
      if (clientInfo.subscribedMarkets.has(market)) {
        const socket = this.server.sockets.sockets.get(clientId);
        if (socket) {
          socket.emit('realtime-ticker', {
            market,
            price: tickerData.trade_price,
            change: tickerData.change,
            changeRate: tickerData.signed_change_rate,
            timestamp: tickerData.timestamp,
            volume: tickerData.acc_trade_volume_24h,
          });
        }
      }
    });
  }

  @Cron('0 * * * * *')
  async handleNewCandle() {
    const markets = ['KRW-XRP', 'KRW-BTC', 'KRW-ETH'];
    for (const market of markets) {
      try {
        const latestCandle = await this.upbitService.getLatestCandle(market);
        this.clientData.forEach((clientInfo, clientId) => {
          if (clientInfo.subscribedMarkets.has(market)) {
            const socket = this.server.sockets.sockets.get(clientId);
            if (socket) {
              const candles = clientInfo.candleData.get(market) || [];
              candles.push(latestCandle);
              if (candles.length > 200) candles.shift();
              clientInfo.candleData.set(market, candles);
              socket.emit('new-candle', {
                market,
                candle: latestCandle,
                timestamp: new Date().toISOString(),
              });
            }
          }
        });
      } catch (error: any) {
        console.error(
          `Error getting latest candle for ${market}:`,
          error?.message,
        );
      }
    }
  }

  @Cron('*/30 * * * * *')
  sendServerStatus() {
    const connectedClients = this.clientData.size;
    this.server.emit('server-status', {
      connectedClients,
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    });
  }
}
