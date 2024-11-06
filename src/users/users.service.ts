import { Injectable } from '@nestjs/common';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { CreateUserDto } from './users.dto';
import { USER_ERRORS } from './users.exception';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  async findUserByEmail(email: string) {
    return await this.usersRepository.findUserByEmail(email);
  }

  async findUserByNickname(nickname: string) {
    return await this.usersRepository.findUserByNickname(nickname);
  }

  async createUser(createUserDto: CreateUserDto) {
    const { email, password, nickname } = createUserDto;

    const emailExists = await this.findUserByEmail(email);

    if (emailExists) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATE_EMAIL);
    }

    const nicknameExists = await this.findUserByNickname(nickname);

    if (nicknameExists) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATE_NICKNAME);
    }

    const hashedPassword = await this.hashPassword(password);

    createUserDto.password = hashedPassword;

    return await this.usersRepository.createUser(createUserDto);
  }
}
