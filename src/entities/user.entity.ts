import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
} from 'typeorm';
import { XrpHolding } from './xrp-holding.entity';

export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn({ name: 'id' })
  meIdx: number;

  @Column({ unique: true, name: 'email' })
  meEmail: string;

  @Column({ name: 'password' })
  mePassword: string;

  @Column({ nullable: true, name: 'nickname' })
  meNickname: string;

  @Column({ default: true, name: 'isActive' })
  meIsActive: boolean;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.USER,
    name: 'role',
  })
  meRole: UserRole;

  @Column({ nullable: true, name: 'refreshToken' })
  meRefreshToken: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToOne(() => XrpHolding, (holding) => holding.user)
  xrpHolding: XrpHolding;
}
