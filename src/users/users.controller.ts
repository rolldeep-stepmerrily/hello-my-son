import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@@decorators';

import { CreateUserDto, SignInDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 가입' })
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    await this.usersService.signIn(signInDto);
  }

  @ApiOperation({ summary: '초대 링크 생성 및 조회' })
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('jwt'))
  @Get('invite')
  async generateInviteLink(@User('id') userId: number) {
    return await this.usersService.generateInviteLink(userId);
  }
}
