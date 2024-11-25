import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@@decorators';

import { CreateUserDto, CreateUserWithInviteLinkDto, SignInDto, ValidateInviteLinkDto } from './users.dto';
import { UsersService } from './users.service';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @ApiOperation({ summary: '회원 가입' })
  @Post('sign-up')
  async createUser(@Body() createUserDto: CreateUserDto) {
    await this.usersService.createUser(createUserDto);
  }

  @ApiOperation({ summary: '로그인' })
  @Post('sign-in')
  async signIn(@Body() signInDto: SignInDto) {
    return await this.usersService.signIn(signInDto);
  }

  @ApiOperation({ summary: '초대 링크 생성 및 조회' })
  @ApiBearerAuth('accessToken')
  @UseGuards(AuthGuard('jwt'))
  @Get('invitations')
  async generateInviteLink(@User('id') userId: number) {
    return await this.usersService.generateInviteLink(userId);
  }

  @ApiOperation({ summary: '초대 링크 유효성 검사' })
  @Get('invitations/validation')
  async validateInviteLink(@Query() { token }: ValidateInviteLinkDto) {
    return await this.usersService.validateInviteLink(token);
  }

  @ApiOperation({ summary: '초대 링크를 이용한 회원 가입' })
  @Post('invitations/sign-up')
  async createUserWithInviteLink(
    @Body() createUserWithInviteLinkDto: CreateUserWithInviteLinkDto,
    @Query() { token }: ValidateInviteLinkDto,
  ) {
    return await this.usersService.createUserWithInviteLink(createUserWithInviteLinkDto, token);
  }
}
