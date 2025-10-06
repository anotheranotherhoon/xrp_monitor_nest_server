import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
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
  CreateVersionDto,
} from './dto/version-response.dto';
import { Public } from '../auth/decorators/public.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppVersion } from '../entities/app-version.entity';

@ApiTags('📱 버전 관리')
@Controller('version')
export class VersionController {
  constructor(private readonly versionService: VersionService) {}

  @Public()
  @Get('check')
  @ApiOperation({ summary: '앱 버전 체크' })
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
    type: VersionCheckResponseDto,
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '새 버전 등록 (관리자용)' })
  @ApiResponse({
    status: 201,
    description: '버전 등록 성공',
    type: AppVersion,
  })
  async createVersion(
    @Body() createVersionDto: CreateVersionDto,
  ): Promise<AppVersion> {
    return this.versionService.createVersion(createVersionDto);
  }

  @Get('admin/versions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '등록된 버전 목록 조회 (관리자용)' })
  @ApiQuery({
    name: 'platform',
    required: false,
    example: 'ios',
    description: '플랫폼 필터',
  })
  @ApiResponse({
    status: 200,
    description: '버전 목록 조회 성공',
    type: [AppVersion],
  })
  async getVersions(
    @Query('platform') platform?: string,
  ): Promise<AppVersion[]> {
    return this.versionService.getVersions(platform);
  }

  @Put('admin/versions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '버전 정보 수정 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '버전 ID' })
  @ApiResponse({
    status: 200,
    description: '버전 수정 성공',
    type: AppVersion,
  })
  async updateVersion(
    @Param('id') id: number,
    @Body() updateData: Partial<CreateVersionDto>,
  ): Promise<AppVersion> {
    return this.versionService.updateVersion(+id, updateData);
  }

  @Delete('admin/versions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '버전 정보 삭제 (관리자용)' })
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
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '버전 활성화/비활성화 토글 (관리자용)' })
  @ApiParam({ name: 'id', example: 1, description: '버전 ID' })
  @ApiResponse({
    status: 200,
    description: '버전 상태 변경 성공',
    type: AppVersion,
  })
  async toggleVersionStatus(@Param('id') id: number): Promise<AppVersion> {
    return this.versionService.toggleVersionStatus(+id);
  }
}
