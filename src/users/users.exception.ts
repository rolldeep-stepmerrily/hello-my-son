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
  USER_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'USER_NOT_FOUND',
    message: '유저를 찾을 수 없습니다.',
  },
  INVALID_PASSWORD: {
    statusCode: HttpStatus.BAD_REQUEST,
    errorCode: 'INVALID_PASSWORD',
    message: '비밀번호가 일치하지 않습니다.',
  },
  FORBIDDEN_REQUEST: {
    statusCode: HttpStatus.FORBIDDEN,
    errorCode: 'FORBIDDEN_REQUEST',
    message: '허용되지 않은 요청입니다.',
  },
  WITHDRAWAL_USER: {
    statusCode: HttpStatus.GONE,
    errorCode: 'WITHDRAWAL_USER',
    message: '탈퇴한 회원입니다.',
  },
  PARENT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'PARENT_NOT_FOUND',
    message: '부모 정보를 찾을 수 없습니다.',
  },
  TINY_URL_ERROR: {
    statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    errorCode: 'TINY_URL_ERROR',
    message: '단축 URL 서비스에서 오류가 발생하였습니다.',
  },
};
