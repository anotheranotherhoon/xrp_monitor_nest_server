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

  @Column({ default: false })
  forceUpdate: boolean;

  @Column({ type: 'text', nullable: true })
  releaseNotes: string;

  @Column({ nullable: true })
  downloadUrl: string;

  @Column({ default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
