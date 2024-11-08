import { Module } from '@nestjs/common';

import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';

import { ChatbotController } from './chatbot.controller';
import { ChatbotRepository } from './chatbot.repository';
import { ChatbotService } from './chatbot.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotRepository],
})
export class ChatbotModule {}
