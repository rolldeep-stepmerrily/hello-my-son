import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

import { CreateUserDto } from './users.dto';

@Injectable()
@CatchDatabaseErrors()
export class UsersRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findUserById(id: number) {
    return await this.prismaService.user.findUnique({
      where: { id },
      select: { id: true, deletedAt: true },
    });
  }

  async findUserByEmail(email: string) {
    return await this.prismaService.user.findUnique({
      where: { email },
      select: { id: true, password: true },
    });
  }

  async findUserByNickname(nickname: string) {
    return await this.prismaService.user.findUnique({
      where: { nickname },
      select: { id: true },
    });
  }

  async createUser(createUserDto: CreateUserDto) {
    return await this.prismaService.user.create({
      data: { ...createUserDto },
      select: { id: true },
    });
  }
}
