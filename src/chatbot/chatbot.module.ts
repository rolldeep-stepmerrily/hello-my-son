import { Module } from '@nestjs/common';

import { ChatbotController } from './chatbot.controller';
import { ChatbotRepository } from './chatbot.repository';
import { ChatbotService } from './chatbot.service';

@Module({
  controllers: [ChatbotController],
  providers: [ChatbotService, ChatbotRepository],
})
export class ChatbotModule {}
