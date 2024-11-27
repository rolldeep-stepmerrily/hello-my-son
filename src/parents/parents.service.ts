import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { UsersRepository } from 'src/users/users.repository';

import { PARENT_ERRORS } from './parents.exception';
import { ParentsRepository } from './parents.repository';

@Injectable()
export class ParentsService {
  constructor(
    private readonly parentsRepository: ParentsRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  async findDetailedParent(userId: number) {
    const foundUser = await this.usersRepository.findUserById(userId);

    if (!foundUser) {
      throw new CustomHttpException(PARENT_ERRORS.USER_NOT_FOUND);
    }

    const { deletedAt, role } = foundUser;

    if (deletedAt) {
      throw new CustomHttpException(PARENT_ERRORS.WITHDRAWAL_USER);
    }

    return await this.parentsRepository.findDetailedParent(foundUser.id, role);
  }
}
