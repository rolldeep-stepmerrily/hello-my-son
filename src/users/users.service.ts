import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { CustomHttpException } from '@@exceptions';

import { CreateUserDto, SignInDto } from './users.dto';
import { USER_ERRORS } from './users.exception';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    @Inject('NODE_ENV') private readonly nodeEnv: string,
    @Inject('JWT_SECRET_KEY') private readonly jwtSecretKey: string,
  ) {}

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

  async signIn({ email, password }: SignInDto) {
    const user = await this.findUserByEmail(email);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    const isMatchedPassword = await bcrypt.compare(password, user.password);

    if (!isMatchedPassword) {
      throw new CustomHttpException(USER_ERRORS.INVALID_PASSWORD);
    }

    const expiresIn = this.nodeEnv === 'production' ? '15m' : '150m';

    return {
      accessToken: this.jwtService.sign({ sub: 'access', id: user.id }, { secret: this.jwtSecretKey, expiresIn }),
      refreshToken: this.jwtService.sign({ sub: 'refresh', id: user.id }, { secret: this.jwtSecretKey }),
    };
  }
}
