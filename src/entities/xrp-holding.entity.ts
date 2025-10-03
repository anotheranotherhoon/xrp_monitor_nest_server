import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { User } from './user.entity';

@Entity('xrp_holdings')
export class XrpHolding {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('decimal', { precision: 20, scale: 8 })
  quantity: number;

  @Column('decimal', { precision: 10, scale: 2 })
  averagePrice: number;

  @Column('decimal', { precision: 20, scale: 2 })
  totalInvested: number;

  @Column({ nullable: true })
  memo: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => User, (user) => user.xrpHoldings)
  user: User;
}
