import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum KeywordType {
  POSITIVE = 'POSITIVE',
  NEGATIVE = 'NEGATIVE',
  IMPORTANT = 'IMPORTANT',
}

@Entity('keywords')
export class Keyword {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  keyword: string;

  @Column('decimal', { precision: 3, scale: 1 })
  weight: number;

  @Column({
    type: 'enum',
    enum: KeywordType,
  })
  type: KeywordType;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
