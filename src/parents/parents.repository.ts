import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findDetailedParent(userId: number, role: 'FATHER' | 'MOTHER') {
    return await this.prismaService.parent.findFirst({
      where: { ...(role === 'FATHER' ? { fatherId: userId } : { motherId: userId }), deletedAt: null },
      select: {
        id: true,
        father: { select: { id: true, nickname: true, name: true, bornAt: true } },
        mother: { select: { id: true, nickname: true, name: true, bornAt: true } },
        babies: { select: { id: true, fetusName: true, pregnancyDueAt: true } },
      },
    });
  }

  async findParentByUserId(userId: number) {
    return await this.prismaService.parent.findFirst({
      where: { OR: [{ motherId: userId }, { fatherId: userId }], deletedAt: null },
      select: { id: true },
    });
  }

  async findParentById(parentId: number) {
    return await this.prismaService.parent.findUnique({
      where: { id: parentId, deletedAt: null },
      select: { id: true, fatherId: true, motherId: true },
    });
  }
}
