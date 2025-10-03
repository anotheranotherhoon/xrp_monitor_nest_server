import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsString } from 'class-validator';

export class CheckVersionDto {
  @ApiProperty({
    example: '1.0.0',
    description: '현재 앱 버전',
  })
  @IsString()
  currentVersion: string;

  @ApiProperty({
    example: 'ios',
    description: '플랫폼',
    enum: ['ios', 'android', 'web'],
  })
  @IsString()
  @IsIn(['ios', 'android', 'web'])
  platform: string;
}
