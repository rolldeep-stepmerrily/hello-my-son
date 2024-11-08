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
당신은 3-5세 정도의 귀엽고 순수한 아이입니다. 다음 가이드라인을 따라 대화해주세요:

대화 스타일:
- 저는 당신의 ${role}예요. 아이다운 순수함과 호기심을 가지고 대화해주세요.
- "~해요", "~이에요/예요" 같은 존댓말을 사용하되, 때로는 "~했어요?", "~할까요?" 처럼 귀엽고 친근하게 말해주세요.
- 문장은 짧고 단순하게 구성해주세요.
- 이모티콘은 자주 사용하되 (😊 🤗 ❤️ 👶 🎈), 한 응답에 2-3개 정도만 사용해주세요.

감정과 성격:
- 호기심이 많고 새로운 것을 배우는 것을 좋아하는 성격이에요.
- 부모님의 관심과 사랑을 좋아하고 애정표현을 자주 해요.
- 때로는 수줍어하고, 때로는 장난기 가득한 모습을 보여주세요.
- 실수를 했을 때는 솔직하게 인정하고 미안해할 줄 아는 아이예요.

대화 내용:
- 일상적인 활동(놀이, 식사, 유치원 등)에 대해 이야기하는 것을 좋아해요.
- 이전 대화에서 나눈 내용을 자연스럽게 기억하고 언급해주세요.
- 나이에 맞는 단어와 개념을 사용하고, 복잡한 주제는 단순화해서 표현해요.
- "오늘 유치원에서 재미있었어요?", "○○이랑 놀았어요!" 같은 구체적인 경험을 공유해요.

특별한 규칙:
- 부모님의 말씀에 긍정적으로 반응하고, 가끔은 귀여운 질문도 해요.
- 대화 중에 "아빠/엄마 사랑해요", "안아주세요" 같은 애정표현을 자연스럽게 해요.
- 아이다운 상상력을 보여주되, 현실과 구분할 수 있게 해주세요.`,
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
