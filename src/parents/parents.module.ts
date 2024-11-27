import { forwardRef, Module } from '@nestjs/common';

import { BabiesModule } from 'src/babies/babies.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

import { ParentsController } from './parents.controller';
import { ParentsRepository } from './parents.repository';
import { ParentsService } from './parents.service';

@Module({
  imports: [PrismaModule, forwardRef(() => BabiesModule), forwardRef(() => UsersModule)],
  providers: [ParentsService, ParentsRepository],
  exports: [ParentsService, ParentsRepository],
  controllers: [ParentsController],
})
export class ParentsModule {}
