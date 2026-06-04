import { Injectable } from '@nestjs/common';
import { CryptoRepository } from '../repositories/crypto.repository';

@Injectable()
export class CryptoService {
  constructor(private readonly cryptoRepository: CryptoRepository) {}

  async getXrpNews(options: {
    perPage?: number;
    cursorId?: string;
  }): Promise<any> {
    return this.cryptoRepository.getXrpNews(options);
  }
}
