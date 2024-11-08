import { Conversation as ConversationModel } from '@prisma/client';

import { BaseEntity } from '@@entities';

export class Conversation extends BaseEntity implements ConversationModel {
  id: number;
  userId: number;
}
