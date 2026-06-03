import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('tweet_caches')
export class TweetCache {
  @PrimaryGeneratedColumn({ name: 'id' })
  tcIdx: number;

  @Index({ unique: true })
  @Column({ name: 'cache_key' })
  tcCacheKey: string;

  @Column({ name: 'request_type' })
  tcRequestType: string;

  @Column({ name: 'request_params', type: 'jsonb' })
  tcRequestParams: Record<string, unknown>;

  @Column({ name: 'response_body', type: 'jsonb' })
  tcResponseBody: Record<string, unknown>;

  @Column({ name: 'fetched_at', type: 'timestamptz' })
  tcFetchedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
