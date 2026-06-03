import { ApiProperty } from '@nestjs/swagger';
import { PageInfoDto } from 'src/common/dto/paginated-response.dto';
import { ResponseDto } from 'src/common/dto/response.dto';
import { TweetItemDto } from './tweet.dto';

export class TweetPaginatedResultDto {
  @ApiProperty({
    example: 'b26v89c19zqg8o3fosdf',
    description: '다음 호출에 사용할 커서(없으면 null)',
    nullable: true,
  })
  nextCursor?: number | string | null;

  @ApiProperty({ type: PageInfoDto })
  page: PageInfoDto;

  @ApiProperty({ type: [TweetItemDto], description: '트윗 목록' })
  list: TweetItemDto[];
}

export class TweetPaginatedResponseDto extends ResponseDto<TweetPaginatedResultDto> {
  @ApiProperty({ type: TweetPaginatedResultDto })
  result: TweetPaginatedResultDto;
}
