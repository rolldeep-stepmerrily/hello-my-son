import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateBabyDto } from './babies.dto';

@Injectable()
@CatchDatabaseErrors()
export class BabiesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findParent(userId: number) {
    return await this.prismaService.$transaction(async (prisma) => {
      const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });

      return await prisma.parent.findFirst({
        where: user?.role === 'FATHER' ? { fatherId: userId } : { motherId: userId },
        select: { id: true },
      });
    });
  }

  async createBaby(parentId: number, createBabyDto: CreateBabyDto) {
    return await this.prismaService.baby.create({ data: { ...createBabyDto, parentId }, select: { id: true } });
  }

  async findBaby(babyId: number) {
    return await this.prismaService.baby.findUnique({
      where: { id: babyId },
      select: { id: true, fetusName: true, parent: { select: { fatherId: true, motherId: true } } },
    });
  }
}
