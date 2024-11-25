import { $Enums } from '@prisma/client';

export interface IInviteTokenPayload {
  parentId: number;
  inviterType: $Enums.ERole;
  iat?: number;
  exp?: number;
}
