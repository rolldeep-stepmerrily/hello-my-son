import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

import { User } from '@@decorators';

import { ParentsService } from './parents.service';

@ApiTags('parents')
@ApiBearerAuth('accessToken')
@UseGuards(AuthGuard('jwt'))
@Controller('parents')
export class ParentsController {
  constructor(private readonly parentsService: ParentsService) {}

  @ApiOperation({ summary: '부모 정보 상세 조회' })
  @Get()
  async findDetailedParent(@User('id') userId: number) {
    return await this.parentsService.findDetailedParent(userId);
  }
}
