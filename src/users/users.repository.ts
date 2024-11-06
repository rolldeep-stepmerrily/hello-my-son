import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@CatchDatabaseErrors()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true },
    });
  }

  async findUserByNickname(nickname: string) {
    return await this.prismaService.user.findUnique({
      where: { nickname },
      select: { id: true },
    });
  }
}
