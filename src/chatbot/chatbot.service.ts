import { Inject, Injectable } from '@nestjs/common';

import { CustomHttpException, GLOBAL_ERRORS } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { CHATBOT_ERRORS } from './chatbot.exception';
import { IAnswer } from './chatbot.interface';
import { ChatbotRepository } from './chatbot.repository';

@Injectable()
export class ChatbotService {
  #perplexityUrl = 'https://api.perplexity.ai/chat/completions';
  #model = 'llama-3.1-sonar-small-128k-chat';

  constructor(
    private readonly chatbotRepository: ChatbotRepository,
    private readonly userRepository: UsersRepository,
    @Inject('PERPLEXITY_API_KEY') private readonly apiKey: string,
  ) {}

  async sendMessage(userId: number, content: string, conversationId?: number) {
    if (!conversationId) {
      const newConversation = await this.chatbotRepository.createConversation(userId);

      conversationId = newConversation.id;
    }

    const user = await this.userRepository.findUserById(userId);

    if (!user) {
      throw new CustomHttpException(CHATBOT_ERRORS.USER_NOT_FOUND);
    }

    await this.chatbotRepository.saveMessage(userId, content, 'USER', conversationId);

    const findMessages = await this.chatbotRepository.findMessages(conversationId);

    const messageHistory = findMessages.map((message) => ({
      role: message.sender === 'USER' ? 'user' : 'assistant',
      content: message.content,
    }));

    const role = user.role === 'FATHER' ? '아빠' : '엄마';

    const systemPrompt = {
      role: 'system',
      content: `
      - 저의 아이인것 처럼 대화를 이어나가 주세요. 저는 당신의 ${role} 이에요.
      - 이전 대화 내용을 잘 기억하고 참조하여 일관성 있게 대화해주세요.
      - 유아틱하고 친근한 말투를 사용해주세요.
      - 이모지를 적절히 사용해주세요. 
      - 이전 대화에서 언급된 정보들을 자연스럽게 활용해주세요.
      - 항상 한국어만을 사용하고, 존댓말을 사용해주세요.`,
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

    console.log(JSON.stringify(payload));

    if (!response.ok) {
      throw new CustomHttpException(GLOBAL_ERRORS.NETWORK_ERROR);
    }

    const data: IAnswer = await response.json();

    const botResponse = data.choices[0].message.content;

    console.log(botResponse);

    await this.chatbotRepository.saveMessage(userId, botResponse, 'BOT', conversationId);
  }
}
