import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('app_versions')
export class AppVersion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  version: string;

  @Column()
  platform: string; // 'ios', 'android', 'web'

  @Column()
  minimumVersion: string;

  @Column({ default: 1 })
  appStatus: number; // 1: 정상, 2: 강제업데이트, 3: 점검중

  @Column({ type: 'text', nullable: true })
  releaseNotes: string;

  @Column({ nullable: true })
  downloadUrl: string;

  @Column({ nullable: true })
  apiDomain: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
