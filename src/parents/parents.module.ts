import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { ParentsRepository } from './parents.repository';
import { ParentsService } from './parents.service';

@Module({
  imports: [PrismaModule],
  providers: [ParentsService, ParentsRepository],
  exports: [ParentsService, ParentsRepository],
})
export class ParentsModule {}
