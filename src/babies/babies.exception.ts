import { HttpStatus } from '@nestjs/common';

export const BABY_ERRORS = {
  PARENT_NOT_FOUND: {
    statusCode: HttpStatus.NOT_FOUND,
    errorCode: 'PARENT_NOT_FOUND',
    message: '부모 정보를 찾을 수 없습니다.',
  },
};
