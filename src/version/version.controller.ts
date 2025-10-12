import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';

import { VersionService } from './version.service';
import {
  VersionCheckResponseDto,
  VersionCheckWrapperDto,
  CreateVersionDto,
  UpdateVersionDto,
  VersionListResponseDto,
  VersionItemDto,
} from './dto/version-response.dto';
import { Public } from '../auth/decorators/public.decorator';
import { Admin } from '../auth/decorators/admin.decorator';

@ApiTags('📱 버전 관리')
@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  private formatToKoreanTime(date: Date): string {
    if (!date) return '';
    const koreanTime = new Date(
      date.toLocaleString('en-US', { timeZone: 'Asia/Seoul' }),
    );
    const year = koreanTime.getFullYear();
    const month = String(koreanTime.getMonth() + 1).padStart(2, '0');
    const day = String(koreanTime.getDate()).padStart(2, '0');
    const hours = String(koreanTime.getHours()).padStart(2, '0');
    const minutes = String(koreanTime.getMinutes()).padStart(2, '0');
    const seconds = String(koreanTime.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  @Public()
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
        data: {
          $ref: '#/components/schemas/VersionCheckResponseDto',
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

  @Post('admin/versions')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '새 버전 등록 (관리자용)',
    description:
      '새로운 앱 버전을 등록합니다. 버전, 플랫폼, 심사버전, Shorebird 버전, 배포상태 등을 설정할 수 있습니다.',
  })
  @ApiResponse({
    status: 201,
    description: '버전 등록 성공',
    type: VersionItemDto,
    schema: {
      $ref: '#/components/schemas/VersionItemDto',
    },
  })
  async createVersion(
    @Body() createVersionDto: CreateVersionDto,
  ): Promise<any> {
    const version = await this.versionService.createVersion(createVersionDto);
    return {
      ...version,
      createdAt: this.formatToKoreanTime(version.createdAt),
      updatedAt: this.formatToKoreanTime(version.updatedAt),
    };
  }

  @Get('admin/versions')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '등록된 버전 목록 조회 (관리자용)',
    description:
      '등록된 모든 버전의 목록을 조회합니다. 플랫폼으로 필터링 가능하며, 심사버전, Shorebird 버전, 배포상태 등의 정보가 포함됩니다.',
  })
  @ApiQuery({
    name: 'platform',
    required: false,
    example: 'ios',
    description: '플랫폼 필터',
  })
  @ApiResponse({
    status: 200,
    description: '버전 목록 조회 성공',
    type: VersionListResponseDto,
    schema: {
      type: 'object',
      properties: {
        list: {
          type: 'array',
          items: {
            $ref: '#/components/schemas/VersionItemDto',
          },
        },
      },
    },
  })
  async getVersions(
    @Query('platform') platform?: string,
  ): Promise<{ list: any[] }> {
    const versions = await this.versionService.getVersions(platform);
    const list = versions.map((version) => ({
      ...version,
      createdAt: this.formatToKoreanTime(version.createdAt),
      updatedAt: this.formatToKoreanTime(version.updatedAt),
    }));
    return { list };
  }

  @Put('admin/versions/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '버전 정보 수정 (관리자용)',
    description:
      '기존 버전의 정보를 수정합니다. 모든 필드는 선택사항이며, 수정하고 싶은 필드만 전송하면 됩니다.',
  })
  @ApiParam({ name: 'id', example: 1, description: '버전 ID' })
  @ApiResponse({
    status: 200,
    description: '버전 수정 성공',
    type: VersionItemDto,
    schema: {
      $ref: '#/components/schemas/VersionItemDto',
    },
  })
  async updateVersion(
    @Param('id') id: number,
    @Body() updateData: UpdateVersionDto,
  ): Promise<any> {
    const version = await this.versionService.updateVersion(+id, updateData);
    return {
      ...version,
      createdAt: this.formatToKoreanTime(version.createdAt),
      updatedAt: this.formatToKoreanTime(version.updatedAt),
    };
  }

  @Delete('admin/versions/:id')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '버전 정보 삭제 (관리자용)',
    description: '등록된 버전 정보를 삭제합니다.',
  })
  @ApiParam({ name: 'id', example: 1, description: '버전 ID' })
  @ApiResponse({
    status: 200,
    description: '버전 삭제 성공',
  })
  async deleteVersion(@Param('id') id: number): Promise<{ message: string }> {
    await this.versionService.deleteVersion(+id);
    return { message: '버전 정보가 삭제되었습니다.' };
  }

  @Put('admin/versions/:id/toggle')
  @Admin()
  @ApiBearerAuth()
  @ApiOperation({
    summary: '버전 활성화/비활성화 토글 (관리자용)',
    description:
      '버전의 활성화 상태를 토글합니다. 활성화된 버전만 버전 체크 API에서 사용됩니다.',
  })
  @ApiParam({ name: 'id', example: 1, description: '버전 ID' })
  @ApiResponse({
    status: 200,
    description: '버전 상태 변경 성공',
    type: VersionItemDto,
    schema: {
      $ref: '#/components/schemas/VersionItemDto',
    },
  })
  async toggleVersionStatus(@Param('id') id: number): Promise<any> {
    const version = await this.versionService.toggleVersionStatus(+id);
    return {
      ...version,
      createdAt: this.formatToKoreanTime(version.createdAt),
      updatedAt: this.formatToKoreanTime(version.updatedAt),
    };
  }
}
