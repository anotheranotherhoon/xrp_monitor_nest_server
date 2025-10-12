import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity('xrp_holdings')
export class XrpHolding {
  @PrimaryGeneratedColumn({ name: 'id' })
  hoIdx: number;

  @Column('decimal', { precision: 20, scale: 8, name: 'quantity' })
  hoQuantity: number;

  @Column('decimal', { precision: 10, scale: 2, name: 'averagePrice' })
  hoAveragePrice: number;

  @Column('decimal', { precision: 20, scale: 2, name: 'totalInvested' })
  hoTotalInvested: number;

  @Column({ nullable: true, name: 'memo' })
  hoMemo: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => User, (user) => user.xrpHolding)
  @JoinColumn({ name: 'userId', referencedColumnName: 'meIdx' })
  user: User;
}
