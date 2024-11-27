import { HttpStatus } from '@nestjs/common';

export const PARENT_ERRORS = {
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: '유저를 찾을 수 없습니다.',
  },
  WITHDRAWAL_USER: {
    statusCode: HttpStatus.GONE,
    errorCode: 'WITHDRAWAL_USER',
    message: '탈퇴한 회원입니다.',
  },
};
