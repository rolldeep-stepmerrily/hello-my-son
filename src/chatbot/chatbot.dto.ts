import { PickType } from '@nestjs/swagger';

import { Message } from './entities';

export class SendMessageDto extends PickType(Message, ['content'] as const) {}
