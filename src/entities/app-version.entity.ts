import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum DeploymentStatus {
  DEPLOYING = 'DEPLOYING', // 배포중
  IN_REVIEW = 'IN_REVIEW', // 심사중
  REVIEW_COMPLETE = 'REVIEW_COMPLETE', // 심사완료
  DEVELOPMENT = 'DEVELOPMENT', // 개발중
}

@Entity('app_versions')
export class AppVersion {
  @PrimaryGeneratedColumn({ name: 'id' })
  veIdx: number;

  @Column({ name: 'version' })
  veVersion: string;

  @Column({ name: 'platform' })
  vePlatform: string; // 'ios', 'android', 'web'

  @Column({ name: 'minimumVersion' })
  veMinimumVersion: string;

  @Column({ name: 'appStatus', default: 1 })
  veAppStatus: number; // 1: 정상, 2: 강제업데이트, 3: 점검중

  @Column({ name: 'releaseNotes', type: 'text', nullable: true })
  veReleaseNotes: string;

  @Column({ name: 'downloadUrl', nullable: true })
  veDownloadUrl: string;

  @Column({ name: 'apiDomain', nullable: true })
  veApiDomain: string;

  @Column({ name: 'isActive', default: true })
  veIsActive: boolean;

  @Column({ name: 'reviewVersion', nullable: true })
  veReviewVersion: string; // 심사버전

  @Column({ name: 'shorebirdVersion', nullable: true })
  veShorebirdVersion: string; // shorebird버전

  @Column({
    name: 'deploymentStatus',
    type: 'enum',
    enum: DeploymentStatus,
    default: DeploymentStatus.DEVELOPMENT,
  })
  veDeploymentStatus: DeploymentStatus; // 배포상태

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
