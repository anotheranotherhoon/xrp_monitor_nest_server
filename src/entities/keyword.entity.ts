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
  @PrimaryGeneratedColumn({ name: 'id' })
  keIdx: number;

  @Column({ name: 'keyword' })
  keKeyword: string;

  @Column({ name: 'weight', type: 'decimal', precision: 3, scale: 1 })
  keWeight: number;

  @Column({
    name: 'type',
    type: 'enum',
    enum: KeywordType,
  })
  keType: KeywordType;

  @Column({ name: 'isActive', default: true })
  keIsActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
