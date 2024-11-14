import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@@decorators';

import { CreateBabyDto } from './babies.dto';
import { BabiesService } from './babies.service';

@ApiTags('babies')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
@Controller('babies')
export class BabiesController {
  constructor(private readonly babiesService: BabiesService) {}

  @ApiOperation({ summary: '아기 등록' })
  @Post()
  async createBaby(@User('id') userId: number, @Body() createBabyDto: CreateBabyDto) {
    await this.babiesService.createBaby(userId, createBabyDto);
  }
}
