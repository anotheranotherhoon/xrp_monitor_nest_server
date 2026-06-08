import { BadRequestException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Popup, PopupActionType } from 'src/entities';
import { ObjectStorageService } from './object-storage.service';
import { PopupService } from './popup.service';

describe('PopupService', () => {
  const repository = {
    count: jest.fn(),
    create: jest.fn((value) => value),
    save: jest.fn((value) => ({ poIdx: 1, ...value })),
    createQueryBuilder: jest.fn(),
  };
  const storage = {
    uploadPopupImage: jest.fn(),
    deleteObject: jest.fn(),
  };
  let service: PopupService;

  beforeEach(async () => {
    jest.clearAllMocks();
    const module = await Test.createTestingModule({
      providers: [
        PopupService,
        { provide: getRepositoryToken(Popup), useValue: repository },
        { provide: ObjectStorageService, useValue: storage },
      ],
    }).compile();
    service = module.get(PopupService);
  });

  it('rejects an eleventh active popup', async () => {
    repository.count.mockResolvedValue(10);

    await expect(
      service.createPopup(
        {
          poTitle: '11번째',
          poDisplayOrder: 10,
          poIsActive: true,
        },
        {
          mimetype: 'image/png',
        } as Express.Multer.File,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('stores display order and object storage key', async () => {
    repository.count.mockResolvedValue(2);
    storage.uploadPopupImage.mockResolvedValue('popups/example.png');

    const result = await service.createPopup(
      {
        poTitle: '두 번째 팝업',
        poDisplayOrder: 2,
        poIsActive: true,
        poActionType: PopupActionType.EXTERNAL_LINK,
        poLinkUrl: 'https://example.com/xrp',
      },
      {
        mimetype: 'image/png',
      } as Express.Multer.File,
    );

    expect(result.poDisplayOrder).toBe(2);
    expect(result.poImageObjectName).toBe('popups/example.png');
    expect(result.poActionType).toBe(PopupActionType.EXTERNAL_LINK);
    expect(result.poLinkUrl).toBe('https://example.com/xrp');
  });

  it('rejects an external link action without a URL', async () => {
    repository.count.mockResolvedValue(0);

    await expect(
      service.createPopup(
        {
          poTitle: '링크 팝업',
          poDisplayOrder: 1,
          poIsActive: true,
          poActionType: PopupActionType.EXTERNAL_LINK,
        },
        {
          mimetype: 'image/png',
        } as Express.Multer.File,
      ),
    ).rejects.toBeInstanceOf(BadRequestException);
  });

  it('only returns popups within the configured exposure period', async () => {
    const queryBuilder = {
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      addOrderBy: jest.fn().mockReturnThis(),
      take: jest.fn().mockReturnThis(),
      getMany: jest.fn().mockResolvedValue([]),
    };
    repository.createQueryBuilder.mockReturnValue(queryBuilder);

    await service.getActivePopups();

    expect(queryBuilder.where).toHaveBeenCalledWith(
      'popup.poIsActive = :isActive',
      { isActive: true },
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      '(popup.poStartAt IS NULL OR popup.poStartAt <= :now)',
      expect.objectContaining({ now: expect.any(Date) }),
    );
    expect(queryBuilder.andWhere).toHaveBeenCalledWith(
      '(popup.poEndAt IS NULL OR popup.poEndAt >= :now)',
      expect.objectContaining({ now: expect.any(Date) }),
    );
  });
});
