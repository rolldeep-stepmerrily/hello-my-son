import { Inject, Injectable } from '@nestjs/common';

import { CustomHttpException, GLOBAL_ERRORS } from '@@exceptions';

import { BabiesRepository } from 'src/babies/babies.repository';
import { UsersRepository } from 'src/users/users.repository';

import { SendMessageDto } from './chatbot.dto';
import { CHATBOT_ERRORS } from './chatbot.exception';
import { IAnswer } from './chatbot.interface';
import { getBabySystemPrompt } from './chatbot.prompt';
import { ChatbotRepository } from './chatbot.repository';

@Injectable()
export class ChatbotService {
  #perplexityUrl = 'https://api.perplexity.ai/chat/completions';
  #model = 'llama-3.1-sonar-small-128k-chat';

  constructor(
    private readonly chatbotRepository: ChatbotRepository,
    private readonly usersRepository: UsersRepository,
    private readonly babiesRepository: BabiesRepository,
    @Inject('PERPLEXITY_API_KEY') private readonly apiKey: string,
  ) {}

  async sendMessage(userId: number, { babyId, content, conversationId }: SendMessageDto) {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new CustomHttpException(CHATBOT_ERRORS.USER_NOT_FOUND);
    }

    if (!conversationId) {
      const newConversation = await this.chatbotRepository.createConversation(user.id);

      conversationId = newConversation.id;
    }

    const conversation = await this.chatbotRepository.findConversation(user.id, conversationId);

    if (!conversation) {
      throw new CustomHttpException(CHATBOT_ERRORS.CONVERSATION_NOT_FOUND);
    }

    await this.chatbotRepository.saveMessage(user.id, content, 'USER', conversationId);

    const findMessages = await this.chatbotRepository.findMessages(conversationId);

    const messageHistory = findMessages.map((message) => ({
      role: message.sender === 'USER' ? 'user' : 'assistant',
      content: message.content,
    }));

    const baby = await this.babiesRepository.findBaby(babyId);

    if (!baby) {
      throw new CustomHttpException(CHATBOT_ERRORS.BABY_NOT_FOUND);
    }

    if (user.role === 'FATHER' && baby.parent?.fatherId !== user.id) {
      throw new CustomHttpException(CHATBOT_ERRORS.USER_NOT_MATCH);
    } else if (user.role === 'MOTHER' && baby.parent?.motherId !== user.id) {
      throw new CustomHttpException(CHATBOT_ERRORS.USER_NOT_MATCH);
    }

    const koreanRole = user.role === 'FATHER' ? '아빠' : '엄마';

    const systemPrompt = {
      role: 'system',
      content: getBabySystemPrompt(koreanRole, baby.fetusName),
    };

    const payload = {
      model: this.#model,
      messages: [systemPrompt, ...messageHistory],
      temperature: 0.7,
      max_tokens: 1000,
    };

    const response = await fetch(this.#perplexityUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new CustomHttpException(GLOBAL_ERRORS.NETWORK_ERROR);
    }

    const data: IAnswer = await response.json();

    const botResponse = data.choices[0].message.content;

    await this.chatbotRepository.saveMessage(userId, botResponse, 'BOT', conversationId);

    return { response: botResponse };
  }
}
