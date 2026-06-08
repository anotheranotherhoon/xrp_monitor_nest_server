import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Admin } from 'src/auth/decorators/admin.decorator';
import { PopupActionType } from 'src/entities';
import { CreatePopupDto, UpdatePopupDto } from './dto/popup.dto';
import { PopupService } from './popup.service';

const popupImageOptions = {
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (
    request: Express.Request,
    file: Express.Multer.File,
    callback: (error: Error | null, acceptFile: boolean) => void,
  ) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    callback(
      allowed.includes(file.mimetype)
        ? null
        : new BadRequestException(
            'JPG, PNG, WebP 이미지만 업로드할 수 있습니다.',
          ),
      allowed.includes(file.mimetype),
    );
  },
};

@ApiTags('관리자 - 팝업')
@Controller('admin/popup')
@Admin()
@ApiBearerAuth()
export class PopupAdminController {
  constructor(private readonly popupService: PopupService) {}

  @Get()
  @ApiOperation({ summary: '팝업 목록 조회' })
  async getPopups() {
    const popups = await this.popupService.getAllPopups();
    return { list: popups.map((popup) => this.toResponse(popup)) };
  }

  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: CreatePopupDto })
  @UseInterceptors(FileInterceptor('image', popupImageOptions))
  @ApiOperation({ summary: '팝업 등록' })
  async createPopup(
    @Body() dto: CreatePopupDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    if (!file) throw new BadRequestException('팝업 이미지는 필수입니다.');
    const popup = await this.popupService.createPopup(dto, file);
    return { data: this.toResponse(popup) };
  }

  @Put(':id')
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UpdatePopupDto })
  @UseInterceptors(FileInterceptor('image', popupImageOptions))
  @ApiOperation({ summary: '팝업 수정' })
  async updatePopup(
    @Param('id') id: number,
    @Body() dto: UpdatePopupDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    const popup = await this.popupService.updatePopup(+id, dto, file);
    return { data: this.toResponse(popup) };
  }

  @Delete(':id')
  @ApiOperation({ summary: '팝업 삭제' })
  async deletePopup(@Param('id') id: number) {
    await this.popupService.deletePopup(+id);
    return { message: '팝업이 삭제되었습니다.' };
  }

  @Put(':id/toggle')
  @ApiOperation({ summary: '팝업 활성화 상태 변경' })
  async togglePopup(@Param('id') id: number) {
    const popup = await this.popupService.togglePopup(+id);
    return { data: this.toResponse(popup) };
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
