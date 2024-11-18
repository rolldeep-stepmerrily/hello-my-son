import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ParentsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findParent(userId: number) {
    return await this.prismaService.parent.findFirst({
      where: { OR: [{ motherId: userId }, { fatherId: userId }], deletedAt: null },
      select: { id: true },
    });
  }
}
