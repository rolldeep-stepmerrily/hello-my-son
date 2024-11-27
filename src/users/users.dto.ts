import { ApiProperty, PickType } from '@nestjs/swagger';

import { IsJWT, IsString } from 'class-validator';

import { User } from './entities';

export class CreateUserWithInviteLinkDto extends PickType(User, [
  'email',
  'password',
  'name',
  'nickname',
  'bornAt',
] as const) {}

export class CreateUserDto extends PickType(User, [
  'email',
  'password',
  'name',
  'nickname',
  'role',
  'bornAt',
] as const) {}

export class SignInDto extends PickType(User, ['email', 'password'] as const) {}

export class ValidateInviteLinkDto {
  @ApiProperty({ description: '초대 토큰', required: true })
  @IsString()
  @IsJWT()
  token: string;
}
