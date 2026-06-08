import { Transform } from 'class-transformer';
import {
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { PopupActionType } from 'src/entities';

export class CreatePopupDto {
  @IsString()
  @Length(1, 100)
  poTitle: string;

  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(10)
  poDisplayOrder: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString()
  poStartAt?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString()
  poEndAt?: string | null;

  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  poIsActive: boolean;

  @IsOptional()
  @IsEnum(PopupActionType)
  poActionType?: PopupActionType;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((dto: CreatePopupDto) => Boolean(dto.poLinkUrl))
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  poLinkUrl?: string | null;
}

export class UpdatePopupDto {
  @IsOptional()
  @IsString()
  @Length(1, 100)
  poTitle?: string;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  @Max(10)
  poDisplayOrder?: number;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString()
  poStartAt?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @IsDateString()
  poEndAt?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === true || value === 'true')
  @IsBoolean()
  poIsActive?: boolean;

  @IsOptional()
  @IsEnum(PopupActionType)
  poActionType?: PopupActionType;

  @IsOptional()
  @Transform(({ value }) => (value === '' ? null : value))
  @ValidateIf((dto: UpdatePopupDto) => Boolean(dto.poLinkUrl))
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true })
  poLinkUrl?: string | null;
}
