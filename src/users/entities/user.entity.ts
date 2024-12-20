import { ApiProperty } from '@nestjs/swagger';

import { $Enums, User as UserModel } from '@prisma/client';
import { IsDate, IsEmail, IsEnum, IsString, Length, Matches } from 'class-validator';
import dayjs from 'dayjs';

import { BaseEntity } from '@@entities';

export class User extends BaseEntity implements UserModel {
  id: number;

  @ApiProperty({ required: true, description: '이메일', example: 'rolldeep@stepmerrily.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ required: true, description: '비밀번호(특수 문자 포함)', example: '123456789a!' })
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[`~!@#$%^&*()_=+])[A-Za-z\d`~!@#$%^&*()_=+]{8,16}$/)
  password: string;

  @ApiProperty({ required: true, description: '이름', example: '이영우' })
  @Length(2, 10)
  @IsString()
  name: string;

  @ApiProperty({ required: true, description: '닉네임', example: 'rolldeep' })
  @Matches(/^[a-zA-Z0-9]{4,16}$/)
  nickname: string;

  @ApiProperty({ required: true, description: '아빠 혹은 엄마', example: 'FATHER', enum: $Enums.ERole })
  @IsEnum($Enums.ERole)
  role: $Enums.ERole;

  @ApiProperty({ required: true, description: '생년월일', example: dayjs('1996-08-20').toISOString() })
  @IsDate()
  bornAt: Date;
}
