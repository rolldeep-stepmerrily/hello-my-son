import { Injectable } from '@nestjs/common';

import { CatchDatabaseErrors } from '@@decorators';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
@CatchDatabaseErrors()
export class ChatbotRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createConversation(userId: number) {
    return await this.prismaService.conversation.create({ data: { userId }, select: { id: true } });
  }

  async findConversation(userId: number, conversationId: number) {
    return await this.prismaService.conversation.findUnique({
      where: { id: conversationId, userId, deletedAt: null },
      select: { id: true },
    });
  }

  async findMessages(conversationId: number) {
    return await this.prismaService.message.findMany({
      where: { conversationId },
      select: { id: true, content: true, sender: true, createdAt: true },
      orderBy: { id: 'asc' },
      take: 20,
    });
  }

  async saveMessage(userId: number, content: string, sender: 'USER' | 'BOT', conversationId: number) {
    return await this.prismaService.$transaction(async (prisma) => {
      await prisma.message.create({ data: { conversationId, content, sender }, select: { id: true } });
    });
  }
}
