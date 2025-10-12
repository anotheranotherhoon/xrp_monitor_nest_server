import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as semver from 'semver';

import { AppVersion } from 'src/entities/app-version.entity';
import { CheckVersionDto } from './dto/check-version.dto';
import {
  VersionCheckResponseDto,
  CreateVersionDto,
} from './dto/version-response.dto';

@Injectable()
export class VersionService {
  constructor(
    @InjectRepository(AppVersion)
    private versionRepository: Repository<AppVersion>,
  ) {}

  async checkVersion(
    checkVersionDto: CheckVersionDto,
  ): Promise<VersionCheckResponseDto> {
    const { currentVersion, platform } = checkVersionDto;

    const latestVersion = await this.versionRepository.findOne({
      where: { vePlatform: platform, veIsActive: true },
      order: { createdAt: 'DESC' },
    });

    if (!latestVersion) {
      // 등록된 버전 정보가 없는 경우 업데이트 불필요로 처리
      return {
        veLatestVersion: currentVersion,
        veMinimumVersion: currentVersion,
        veNeedsUpdate: false,
        veAppStatus: 1,
        veDownloadUrl: null,
        veApiDomain: null,
        veReleaseNotes: null,
        veReviewVersion: null,
        veShorebirdVersion: null,
        veDeploymentStatus: null,
      };
    }

    const needsUpdate = semver.gt(latestVersion.veVersion, currentVersion);

    // 앱 상태 결정 로직
    let appStatus = latestVersion.veAppStatus;
    if (
      appStatus === 1 &&
      needsUpdate &&
      semver.lt(currentVersion, latestVersion.veMinimumVersion)
    ) {
      // 최소 버전 미만인 경우 강제 업데이트
      appStatus = 2;
    }

    let releaseNotes: string[] | null = null;
    if (latestVersion.veReleaseNotes) {
      try {
        releaseNotes = latestVersion.veReleaseNotes
          .split('\n')
          .filter((note) => note.trim());
      } catch {
        releaseNotes = [latestVersion.veReleaseNotes];
      }
    }

    return {
      veLatestVersion: latestVersion.veVersion,
      veMinimumVersion: latestVersion.veMinimumVersion,
      veNeedsUpdate: needsUpdate,
      veAppStatus: appStatus,
      veDownloadUrl: latestVersion.veDownloadUrl,
      veApiDomain: latestVersion.veApiDomain,
      veReleaseNotes: releaseNotes,
      veReviewVersion: latestVersion.veReviewVersion,
      veShorebirdVersion: latestVersion.veShorebirdVersion,
      veDeploymentStatus: latestVersion.veDeploymentStatus,
    };
  }

  async createVersion(createVersionDto: CreateVersionDto): Promise<AppVersion> {
    const version = this.versionRepository.create(createVersionDto);
    return this.versionRepository.save(version);
  }

  async getVersions(platform?: string): Promise<AppVersion[]> {
    const where = platform ? { vePlatform: platform } : {};
    return this.versionRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async updateVersion(
    id: number,
    updateData: Partial<CreateVersionDto>,
  ): Promise<AppVersion> {
    await this.versionRepository.update(id, updateData);
    return this.versionRepository.findOne({ where: { veIdx: id } });
  }

  async deleteVersion(id: number): Promise<void> {
    await this.versionRepository.delete(id);
  }

  async toggleVersionStatus(id: number): Promise<AppVersion> {
    const version = await this.versionRepository.findOne({
      where: { veIdx: id },
    });
    if (version) {
      version.veIsActive = !version.veIsActive;
      return this.versionRepository.save(version);
    }
    throw new Error('Version not found');
  }
}
