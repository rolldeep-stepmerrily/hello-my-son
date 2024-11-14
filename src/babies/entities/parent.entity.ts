import { Parent as ParentModel } from '@prisma/client';

import { BaseEntity } from '@@entities';

export class Parent extends BaseEntity implements ParentModel {
  id: number;
  fatherId: number | null;
  motherId: number | null;
}
