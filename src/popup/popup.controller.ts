import { Controller, Get, NotFoundException, Param, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/auth/decorators/public.decorator';
import { PopupActionType } from 'src/entities';
import { PopupService } from './popup.service';

@ApiTags('팝업')
@Controller('popup')
@Public()
export class PopupController {
  constructor(private readonly popupService: PopupService) {}

  @Get('active')
  @ApiOperation({ summary: '현재 노출 가능한 팝업 목록 조회' })
  async getActivePopups() {
    const popups = await this.popupService.getActivePopups();
    return {
      list: popups.map((popup) => this.toResponse(popup)),
    };
  }

  @Get(':id/image')
  @ApiOperation({ summary: '팝업 이미지 조회' })
  async getPopupImage(
    @Param('id') id: number,
    @Res() response: Response,
  ): Promise<void> {
    const popup = await this.popupService.getPopup(+id);
    try {
      const object = await this.popupService.getImage(popup.poImageObjectName);
      response.setHeader(
        'Content-Type',
        object.contentType || popup.poImageMimeType,
      );
      response.setHeader(
        'Cache-Control',
        object.cacheControl || 'public, max-age=86400',
      );
      const value = object.value as NodeJS.ReadableStream;
      value.pipe(response);
    } catch {
      throw new NotFoundException('팝업 이미지를 찾을 수 없습니다.');
    }
  }

  private toResponse(popup: {
    poIdx: number;
    poTitle: string;
    poDisplayOrder: number;
    poStartAt: Date | null;
    poEndAt: Date | null;
    poIsActive: boolean;
    poActionType: PopupActionType;
    poLinkUrl: string | null;
    createdAt: Date;
    updatedAt: Date;
  }) {
    return {
      ...popup,
      poImageUrl: `/popup/${popup.poIdx}/image`,
    };
  }
}
