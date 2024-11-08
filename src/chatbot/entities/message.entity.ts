import { ApiProperty } from '@nestjs/swagger';

import { $Enums, Message as MessageModel } from '@prisma/client';
import { IsString, MaxLength } from 'class-validator';

import { BaseEntity } from '@@entities';

export class Message extends BaseEntity implements MessageModel {
  id: string;
  conversationId: number;

  @ApiProperty({ description: '메시지 내용', required: true, example: '안녕하세요' })
  @IsString()
  @MaxLength(300)
  content: string;

  sender: $Enums.ESender;
}
