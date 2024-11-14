import { HttpStatus } from '@nestjs/common';

export const CHATBOT_ERRORS = {
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: '사용자를 찾을 수 없습니다.',
  },
  CONVERSATION_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'CONVERSATION_NOT_FOUND',
    message: '대화내역을 찾을 수 없습니다.',
  },
  BABY_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'BABY_NOT_FOUND',
    message: '아기 정보를 찾을 수 없습니다.',
  },
  USER_NOT_MATCH: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'USER_NOT_MATCH',
    message: '사용자 정보가 일치하지 않습니다.',
  },
};
