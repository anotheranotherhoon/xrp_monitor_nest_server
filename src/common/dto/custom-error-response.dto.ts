import { ApiProperty } from '@nestjs/swagger';
import { ResponseDto } from './response.dto';

export class CustomErrorResponse<T = null> extends ResponseDto<T> {
  @ApiProperty({ example: false })
  success: boolean = false;

  @ApiProperty({ example: 404 })
  code: number;

  @ApiProperty({ example: 'PIT 컨텍스트가 만료되었거나 잘못되었습니다.' })
  message: string;

  @ApiProperty({ example: null })
  result: T;

  constructor(code: number, message: string, result?: T) {
    super();
    this.code = code;
    this.message = message;
    this.result = result ?? (null as T);
  }
}
