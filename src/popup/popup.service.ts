import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Popup, PopupActionType } from 'src/entities';
import { CreatePopupDto, UpdatePopupDto } from './dto/popup.dto';
import { ObjectStorageService } from './object-storage.service';

@Injectable()
export class PopupService {
  constructor(
    @InjectRepository(Popup)
    private readonly popupRepository: Repository<Popup>,
    private readonly objectStorageService: ObjectStorageService,
  ) {}

  async getActivePopups(): Promise<Popup[]> {
    const now = new Date();
    return this.popupRepository
      .createQueryBuilder('popup')
      .where('popup.poIsActive = :isActive', { isActive: true })
      .andWhere('(popup.poStartAt IS NULL OR popup.poStartAt <= :now)', { now })
      .andWhere('(popup.poEndAt IS NULL OR popup.poEndAt >= :now)', { now })
      .orderBy('popup.poDisplayOrder', 'ASC')
      .addOrderBy('popup.createdAt', 'ASC')
      .take(10)
      .getMany();
  }

  getAllPopups(): Promise<Popup[]> {
    return this.popupRepository.find({
      order: { poDisplayOrder: 'ASC', createdAt: 'DESC' },
    });
  }

  async getPopup(id: number): Promise<Popup> {
    const popup = await this.popupRepository.findOne({
      where: { poIdx: id },
    });
    if (!popup) throw new NotFoundException('팝업을 찾을 수 없습니다.');
    return popup;
  }

  async createPopup(
    dto: CreatePopupDto,
    file: Express.Multer.File,
  ): Promise<Popup> {
    this.validatePeriod(dto.poStartAt, dto.poEndAt);
    const action = this.validateAction(
      dto.poActionType ?? PopupActionType.NONE,
      dto.poLinkUrl,
    );
    await this.validateActiveLimit(dto.poIsActive);

    const objectName = await this.objectStorageService.uploadPopupImage(file);
    try {
      const popup = this.popupRepository.create({
        poTitle: dto.poTitle,
        poDisplayOrder: dto.poDisplayOrder,
        poStartAt: dto.poStartAt ? new Date(dto.poStartAt) : null,
        poEndAt: dto.poEndAt ? new Date(dto.poEndAt) : null,
        poIsActive: dto.poIsActive,
        poActionType: action.type,
        poLinkUrl: action.linkUrl,
        poImageObjectName: objectName,
        poImageMimeType: file.mimetype,
      });
      return await this.popupRepository.save(popup);
    } catch (error) {
      await this.objectStorageService.deleteObject(objectName);
      throw error;
    }
  }

  async updatePopup(
    id: number,
    dto: UpdatePopupDto,
    file?: Express.Multer.File,
  ): Promise<Popup> {
    const popup = await this.getPopup(id);
    const nextStartAt =
      dto.poStartAt === undefined
        ? popup.poStartAt?.toISOString()
        : dto.poStartAt;
    const nextEndAt =
      dto.poEndAt === undefined ? popup.poEndAt?.toISOString() : dto.poEndAt;
    this.validatePeriod(nextStartAt, nextEndAt);
    const action = this.validateAction(
      dto.poActionType ?? popup.poActionType ?? PopupActionType.NONE,
      dto.poLinkUrl === undefined ? popup.poLinkUrl : dto.poLinkUrl,
    );

    if (dto.poIsActive === true && !popup.poIsActive) {
      await this.validateActiveLimit(true);
    }

    const previousObjectName = popup.poImageObjectName;
    let uploadedObjectName: string | null = null;
    if (file) {
      uploadedObjectName =
        await this.objectStorageService.uploadPopupImage(file);
      popup.poImageObjectName = uploadedObjectName;
      popup.poImageMimeType = file.mimetype;
    }

    if (dto.poTitle !== undefined) popup.poTitle = dto.poTitle;
    if (dto.poDisplayOrder !== undefined) {
      popup.poDisplayOrder = dto.poDisplayOrder;
    }
    if (dto.poStartAt !== undefined) {
      popup.poStartAt = dto.poStartAt ? new Date(dto.poStartAt) : null;
    }
    if (dto.poEndAt !== undefined) {
      popup.poEndAt = dto.poEndAt ? new Date(dto.poEndAt) : null;
    }
    if (dto.poIsActive !== undefined) popup.poIsActive = dto.poIsActive;
    popup.poActionType = action.type;
    popup.poLinkUrl = action.linkUrl;

    try {
      const saved = await this.popupRepository.save(popup);
      if (uploadedObjectName) {
        await this.objectStorageService.deleteObject(previousObjectName);
      }
      return saved;
    } catch (error) {
      if (uploadedObjectName) {
        await this.objectStorageService.deleteObject(uploadedObjectName);
      }
      throw error;
    }
  }

  async deletePopup(id: number): Promise<void> {
    const popup = await this.getPopup(id);
    await this.popupRepository.remove(popup);
    await this.objectStorageService.deleteObject(popup.poImageObjectName);
  }

  async togglePopup(id: number): Promise<Popup> {
    const popup = await this.getPopup(id);
    if (!popup.poIsActive) await this.validateActiveLimit(true);
    popup.poIsActive = !popup.poIsActive;
    return this.popupRepository.save(popup);
  }

  getImage(objectName: string) {
    return this.objectStorageService.getObject(objectName);
  }

  private async validateActiveLimit(willBeActive: boolean): Promise<void> {
    if (!willBeActive) return;
    const activeCount = await this.popupRepository.count({
      where: { poIsActive: true },
    });
    if (activeCount >= 10) {
      throw new BadRequestException(
        '활성 팝업은 최대 10개까지 등록할 수 있습니다.',
      );
    }
  }

  private validatePeriod(startAt?: string | null, endAt?: string | null): void {
    if (startAt && endAt && new Date(startAt) > new Date(endAt)) {
      throw new BadRequestException(
        '팝업 종료일은 시작일보다 이후여야 합니다.',
      );
    }
  }

  private validateAction(
    type: PopupActionType,
    linkUrl?: string | null,
  ): { type: PopupActionType; linkUrl: string | null } {
    if (type === PopupActionType.NONE) {
      return { type, linkUrl: null };
    }

    const normalizedUrl = linkUrl?.trim();
    if (!normalizedUrl) {
      throw new BadRequestException(
        '외부 링크 이동을 선택한 경우 링크 주소는 필수입니다.',
      );
    }

    try {
      const url = new URL(normalizedUrl);
      if (url.protocol !== 'http:' && url.protocol !== 'https:') {
        throw new Error('Unsupported protocol');
      }
    } catch {
      throw new BadRequestException(
        '링크 주소는 http:// 또는 https:// 형식이어야 합니다.',
      );
    }

    return { type, linkUrl: normalizedUrl };
  }
}
