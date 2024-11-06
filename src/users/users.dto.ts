import { PickType } from '@nestjs/swagger';

import { User } from './entities';

export class CreateUserDto extends PickType(User, ['email', 'password', 'nickname', 'role'] as const) {}
