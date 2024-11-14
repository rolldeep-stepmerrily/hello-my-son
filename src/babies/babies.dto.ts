import { PickType } from '@nestjs/swagger';

import { Baby } from './entities';

export class CreateBabyDto extends PickType(Baby, ['fetusName', 'pregnancyDueAt'] as const) {}
