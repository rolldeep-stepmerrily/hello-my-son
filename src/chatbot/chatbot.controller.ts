import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@@decorators';

import { SendMessageDto } from './chatbot.dto';
import { ChatbotService } from './chatbot.service';

@ApiTags('chatbot')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
@Controller('chatbot')
export class ChatbotController {
  constructor(private readonly chatbotService: ChatbotService) {}

  @ApiOperation({ summary: '메시지 전송' })
  @Post()
  async sendMessage(@User('id') userId: number, @Body() { content, conversationId }: SendMessageDto) {
    return await this.chatbotService.sendMessage(userId, content, conversationId);
  }
}
