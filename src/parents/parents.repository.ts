import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

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
