import { forwardRef, Module } from '@nestjs/common';

import { ParentsModule } from 'src/parents/parents.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { BabiesController } from './babies.controller';
import { BabiesRepository } from './babies.repository';
import { BabiesService } from './babies.service';

@Module({
  imports: [PrismaModule, forwardRef(() => ParentsModule)],
  controllers: [BabiesController],
  providers: [BabiesService, BabiesRepository],
  exports: [BabiesRepository],
})
export class BabiesModule {}
