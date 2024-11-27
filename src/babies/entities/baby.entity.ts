import { ApiProperty } from '@nestjs/swagger';

import { Baby as BabyModel } from '@prisma/client';
import { IsDate, IsOptional, IsString, Length } from 'class-validator';
import dayjs from 'dayjs';

import { BaseEntity } from '@@entities';

export class Baby extends BaseEntity implements BabyModel {
  id: number;
  parentId: number | null;

  @ApiProperty({ required: true, description: '아기 태명', example: '☀️햇살' })
  @Length(1, 5)
  @IsString()
  fetusName: string;

  @ApiProperty({ required: false, description: '아기 이름', example: '이선' })
  @IsOptional()
  @Length(1, 5)
  @IsString()
  name: string;

  @ApiProperty({ required: false, description: '아기 예상 출산일', example: dayjs('2025-04-05').toISOString() })
  @IsOptional()
  @IsDate()
  pregnancyDueAt: Date | null;

  @ApiProperty({ required: false, description: '아기 생년월일', example: null })
  @IsOptional()
  @IsDate()
  bornAt: Date | null;
}
