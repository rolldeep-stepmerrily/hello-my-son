import { Inject, Injectable } from '@nestjs/common';

import { CustomHttpException, GLOBAL_ERRORS } from '@@exceptions';

import { IAnswer } from './chatbot.interface';
import { ChatbotRepository } from './chatbot.repository';

@Injectable()
export class ChatbotService {
  #perplexityUrl = 'https://api.perplexity.ai/chat/completions';

  constructor(
    private readonly chatbotRepository: ChatbotRepository,
    @Inject('PERPLEXITY_API_KEY') private readonly apiKey: string,
  ) {}

  async sendMessage(userId: number, content: string) {
    // await this.chatbotRepository.saveMessage(userId, content);

    const payload = { model: 'llama-3.1-sonar-small-128k-online', messages: [{ content, role: 'user' }] };

    const response = await fetch(this.#perplexityUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${this.apiKey}` },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new CustomHttpException(GLOBAL_ERRORS.NETWORK_ERROR);
    }

    const data: IAnswer = await response.json();
  }
}
