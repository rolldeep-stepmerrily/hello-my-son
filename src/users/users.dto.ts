import { PickType } from '@nestjs/swagger';

import { User } from './entities';

export class CreateUserDto extends PickType(User, ['email', 'password', 'nickname', 'role'] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}
