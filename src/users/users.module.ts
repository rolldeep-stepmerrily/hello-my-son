import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { ParentsModule } from 'src/parents/parents.module';
import { PrismaModule } from 'src/prisma/prisma.module';

import { JWTStrategy } from './strategies';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, JwtModule, ParentsModule],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JWTStrategy],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
