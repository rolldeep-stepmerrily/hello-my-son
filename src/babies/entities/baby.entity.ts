import { Baby as BabyModel } from '@prisma/client';

import { BaseEntity } from '@@entities';

export class Baby extends BaseEntity implements BabyModel {
  id: number;
  parentId: number | null;
  fetusName: string | null;
  name: string | null;
  pregnancyDueAt: Date | null;
}
