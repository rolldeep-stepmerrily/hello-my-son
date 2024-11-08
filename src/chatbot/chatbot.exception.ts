import { HttpStatus } from '@nestjs/common';

export const CHATBOT_ERRORS = {
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다.',
  },
};
