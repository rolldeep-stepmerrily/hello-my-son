import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';

import { BabiesController } from './babies.controller';
import { BabiesRepository } from './babies.repository';
import { BabiesService } from './babies.service';

@Module({
  imports: [PrismaModule],
  controllers: [BabiesController],
  providers: [BabiesService, BabiesRepository],
  exports: [BabiesRepository],
})
export class BabiesModule {}
