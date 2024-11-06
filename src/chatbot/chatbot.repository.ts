import { Injectable } from '@nestjs/common';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ChatbotRepository {
  constructor(private readonly prismaService: PrismaService) {}
}
