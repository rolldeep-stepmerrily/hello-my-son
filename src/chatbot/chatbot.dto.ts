import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsOptional, IsPositive } from 'class-validator';

import { Message } from './entities';

export class SendMessageDto extends PickType(Message, ['content'] as const) {
  @ApiProperty({ description: '대화 ID', required: false, example: 1 })
  @IsOptional()
  @IsPositive()
  conversationId?: number;
}
