import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PopupActionType {
  NONE = 'NONE',
  EXTERNAL_LINK = 'EXTERNAL_LINK',
}

@Entity('popups')
export class Popup {
  @PrimaryGeneratedColumn({ name: 'id' })
  poIdx: number;

  @Column({ name: 'title', length: 100 })
  poTitle: string;

  @Column({ name: 'imageObjectName' })
  poImageObjectName: string;

  @Column({ name: 'imageMimeType', length: 100 })
  poImageMimeType: string;

  @Column({ name: 'displayOrder', type: 'int' })
  poDisplayOrder: number;

  @Column({ name: 'startAt', type: 'timestamptz', nullable: true })
  poStartAt: Date | null;

  @Column({ name: 'endAt', type: 'timestamptz', nullable: true })
  poEndAt: Date | null;

  @Column({ name: 'isActive', default: true })
  poIsActive: boolean;

  @Column({
    name: 'actionType',
    type: 'enum',
    enum: PopupActionType,
    default: PopupActionType.NONE,
  })
  poActionType: PopupActionType;

  @Column({ name: 'linkUrl', type: 'varchar', length: 2048, nullable: true })
  poLinkUrl: string | null;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
