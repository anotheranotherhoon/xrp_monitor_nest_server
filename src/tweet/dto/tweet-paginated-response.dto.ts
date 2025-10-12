import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from 'src/common/dto/paginated-response.dto';
import { TweetItemDto } from './tweet.dto';

export class TweetPaginatedResultDto {
  @ApiProperty({
    example: 'b26v89c19zqg8o3fosdf',
    description: '다음 커서 ID',
    nullable: true,
  })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ type: [TweetItemDto], description: '트윗 목록' })
  list: TweetItemDto[];
}

export class TweetPaginatedResponseDto {
  @ApiProperty({ type: TweetPaginatedResultDto })
  result: TweetPaginatedResultDto;
}
