import { HttpStatus } from '@nestjs/common';

export const USER_ERRORS = {
  DUPLICATE_EMAIL: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATE_EMAIL',
    message: '이미 가입된 이메일입니다.',
  },
  DUPLICATE_NICKNAME: {
    statusCode: HttpStatus.CONFLICT,
    errorCode: 'DUPLICATE_NICKNAME',
    message: '이미 사용중인 닉네임입니다.',
  },
};
