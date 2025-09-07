import { Injectable } from '@nestjs/common';
import { TweetRepository } from '../repositories/tweet.repository';

@Injectable()
export class TweetService {
  constructor(private readonly tweetRepository: TweetRepository) {}

  async getUserTweets(options: {
    userId: string;
    maxResults?: number;
  }): Promise<any> {
    return this.tweetRepository.getUserTweets(options);
  }

  async searchRecent(options: {
    query: string;
    maxResults?: number;
    nextToken?: string;
  }): Promise<any> {
    return this.tweetRepository.searchRecent(options);
  }
}
