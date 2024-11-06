import { ApiProperty } from '@nestjs/swagger';

import { $Enums, User as UserModel } from '@prisma/client';
import { IsEmail, IsEnum, Matches } from 'class-validator';

import { BaseEntity } from '@@entities';

export class User extends BaseEntity implements UserModel {
  id: number;

  @ApiProperty({ required: true, description: '이메일', example: 'rolldeep@stepmerrily.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '비밀번호(특수 문자 포함)', example: '123456789a!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/)
  password: string;

  @ApiProperty({ required: true, description: '닉네임', example: 'rolldeep' })
  @Matches(/^[a-zA-Z0-9]{4,16}$/)
  nickname: string;

  @ApiProperty({ required: true, description: '아빠 혹은 엄마', example: 'FATHER', enum: $Enums.ERole })
  @IsEnum($Enums.ERole)
  role: $Enums.ERole;
}
