import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';
import dayjs from 'dayjs';

import { CustomHttpException } from '@@exceptions';

import { ParentsRepository } from 'src/parents/parents.repository';

import { CreateUserDto, CreateUserWithInviteLinkDto, SignInDto } from './users.dto';
import { USER_ERRORS } from './users.exception';
import { IInviteTokenPayload } from './users.interface';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  #tinyUrl = 'https://api.tinyurl.com';

  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly jwtService: JwtService,
    private readonly parentsRepository: ParentsRepository,
    @Inject('NODE_ENV') private readonly nodeEnv: string,
    @Inject('JWT_SECRET_KEY') private readonly jwtSecretKey: string,
    @Inject('SERVER_URL') private readonly serverUrl: string,
    @Inject('TINY_URL_API_KEY') private readonly tinyUrlApiKey: string,
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

  async createUserWithInviteLink(createUserWithInviteLinkDto: CreateUserWithInviteLinkDto, token: string) {
    const { parentId, inviterType } = await this.validateInviteLink(token);

    const { email, password, nickname } = createUserWithInviteLinkDto;

    const emailExists = await this.findUserByEmail(email);

    if (emailExists) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATE_EMAIL);
    }

    const nicknameExists = await this.findUserByNickname(nickname);

    if (nicknameExists) {
      throw new CustomHttpException(USER_ERRORS.DUPLICATE_NICKNAME);
    }

    const hashedPassword = await this.hashPassword(password);

    createUserWithInviteLinkDto.password = hashedPassword;

    return await this.usersRepository.createUserWithInviteLink(createUserWithInviteLinkDto, parentId, inviterType);
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

  generateInviteToken(payload: IInviteTokenPayload) {
    return this.jwtService.sign(payload, { secret: this.jwtSecretKey, expiresIn: '7d' });
  }

  async generateInviteLink(userId: number) {
    const user = await this.usersRepository.findUserById(userId);

    if (!user) {
      throw new CustomHttpException(USER_ERRORS.USER_NOT_FOUND);
    }

    const parent = await this.parentsRepository.findParentByUserId(userId);

    if (!parent) {
      throw new CustomHttpException(USER_ERRORS.PARENT_NOT_FOUND);
    }

    const inviteToken = this.generateInviteToken({ parentId: parent.id, inviterType: user.role });

    const payload = { url: `${this.serverUrl}/api/users/invitations/validation?token=${inviteToken}` };

    const response = await fetch(`${this.#tinyUrl}/create?api_token=${this.tinyUrlApiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new CustomHttpException(USER_ERRORS.TINY_URL_ERROR);
    }

    const { data } = await response.json();

    return { uri: data.tiny_url };
  }

  async validateInviteLink(token: string) {
    const payload: IInviteTokenPayload = this.jwtService.verify(token, { secret: this.jwtSecretKey });

    const { parentId, inviterType, iat, exp } = payload;

    if (!parentId || !inviterType || !iat || !exp) {
      throw new CustomHttpException(USER_ERRORS.INVALID_INVITE_LINK);
    }

    const isExpired = exp && dayjs().isAfter(dayjs.unix(exp));

    if (isExpired) {
      throw new CustomHttpException(USER_ERRORS.EXPIRED_INVITE_LINK);
    }

    const parent = await this.parentsRepository.findParentById(parentId);

    if (!parent) {
      throw new CustomHttpException(USER_ERRORS.PARENT_NOT_FOUND);
    }

    if (inviterType === 'FATHER' && parent.motherId) {
      throw new CustomHttpException(USER_ERRORS.FORBIDDEN_REQUEST);
    } else if (inviterType === 'MOTHER' && parent.fatherId) {
      throw new CustomHttpException(USER_ERRORS.FORBIDDEN_REQUEST);
    }

    const signUpUrl = `${this.serverUrl}/api/users/invite/sign-up?token=${token}`;

    return { signUpUrl, parentId, inviterType };
  }
}
