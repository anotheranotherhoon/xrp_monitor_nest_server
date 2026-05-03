import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';

import { VersionService } from './version.service';
import {
  VersionCheckResponseDto,
  VersionCheckWrapperDto,
} from './dto/version-response.dto';
import { Public } from 'src/auth/decorators/public.decorator';

@ApiTags('버전')
@Controller('version')
@Public()
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Get('check')
  @ApiOperation({
    summary: '앱 버전 체크',
    description:
      '현재 앱 버전을 체크하여 업데이트 필요 여부와 앱 상태를 확인합니다. 심사버전, Shorebird 버전, 배포상태 등의 정보도 포함됩니다.',
  })
  @ApiQuery({
    name: 'currentVersion',
    example: '1.0.0',
    description: '현재 앱 버전',
  })
  @ApiQuery({
    name: 'platform',
    example: 'ios',
    description: '플랫폼 (ios, android, web)',
  })
  @ApiResponse({
    status: 200,
    description: '버전 체크 결과',
    type: VersionCheckWrapperDto,
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        code: { type: 'number', example: 200 },
        message: {
          type: 'string',
          example: '요청이 성공적으로 처리되었습니다.',
        },
        result: {
          type: 'object',
          properties: {
            data: {
              $ref: '#/components/schemas/VersionCheckResponseDto',
            },
          },
        },
      },
    },
  })
  async checkVersion(
    @Query('currentVersion') currentVersion: string,
    @Query('platform') platform: string,
  ): Promise<{ data: VersionCheckResponseDto }> {
    const data = await this.versionService.checkVersion({
      currentVersion,
      platform,
    });
    return { data };
  }
}
