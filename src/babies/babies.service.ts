import { Injectable } from '@nestjs/common';

import { CustomHttpException } from '@@exceptions';

import { CreateBabyDto } from './babies.dto';
import { BABY_ERRORS } from './babies.exception';
import { BabiesRepository } from './babies.repository';

@Injectable()
export class BabiesService {
  constructor(private readonly babiesRepository: BabiesRepository) {}

  async createBaby(userId: number, createBabyDto: CreateBabyDto) {
    const parent = await this.babiesRepository.findParent(userId);

    if (!parent) {
      throw new CustomHttpException(BABY_ERRORS.PARENT_NOT_FOUND);
    }

    return await this.babiesRepository.createBaby(parent.id, createBabyDto);
  }
}
