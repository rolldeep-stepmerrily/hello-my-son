import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';

import { ExtractJwt, Strategy } from 'passport-jwt';

import { CustomHttpException } from '@@exceptions';

import { USER_ERRORS } from '../users.exception';
import { UsersRepository } from '../users.repository';

interface IValidate {
  sub: string;
  id: number;
}

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersRepository: UsersRepository,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.getOrThrow<string>('JWT_SECRET_KEY'),
    });
  }

  async validate({ sub, id }: IValidate) {
    if (sub !== 'access') {
      throw new CustomHttpException(USER_ERRORS.FORBIDDEN_REQUEST);
    }

    const user = await this.usersRepository.findUserById(id);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    if (user.deletedAt) {
      throw new CustomHttpException(USER_ERRORS.WITHDRAWAL_USER);
    }

    return user;
  }
}
