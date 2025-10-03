import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as semver from 'semver';

import { AppVersion } from '../entities/app-version.entity';
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
      where: { platform, isActive: true },
      order: { createdAt: 'DESC' },
    });

    if (!latestVersion) {
      // 등록된 버전 정보가 없는 경우 업데이트 불필요로 처리
      return {
        latestVersion: currentVersion,
        minimumVersion: currentVersion,
        needsUpdate: false,
        forceUpdate: false,
        downloadUrl: null,
        releaseNotes: null,
      };
    }

    const needsUpdate = semver.gt(latestVersion.version, currentVersion);
    const forceUpdate =
      needsUpdate &&
      (latestVersion.forceUpdate ||
        semver.lt(currentVersion, latestVersion.minimumVersion));

    let releaseNotes: string[] | null = null;
    if (latestVersion.releaseNotes) {
      try {
        releaseNotes = latestVersion.releaseNotes
          .split('\n')
          .filter((note) => note.trim());
      } catch {
        releaseNotes = [latestVersion.releaseNotes];
      }
    }

    return {
      latestVersion: latestVersion.version,
      minimumVersion: latestVersion.minimumVersion,
      needsUpdate,
      forceUpdate,
      downloadUrl: latestVersion.downloadUrl,
      releaseNotes,
    };
  }

  async createVersion(createVersionDto: CreateVersionDto): Promise<AppVersion> {
    const version = this.versionRepository.create(createVersionDto);
    return this.versionRepository.save(version);
  }

  async getVersions(platform?: string): Promise<AppVersion[]> {
    const where = platform ? { platform } : {};
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
    return this.versionRepository.findOne({ where: { id } });
  }

  async deleteVersion(id: number): Promise<void> {
    await this.versionRepository.delete(id);
  }

  async toggleVersionStatus(id: number): Promise<AppVersion> {
    const version = await this.versionRepository.findOne({ where: { id } });
    if (version) {
      version.isActive = !version.isActive;
      return this.versionRepository.save(version);
    }
    throw new Error('Version not found');
  }
}
