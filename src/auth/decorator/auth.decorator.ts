import { SetMetadata, UseGuards, applyDecorators } from '@nestjs/common';
import { UserRole } from '../../users/enum/user.enum';
import { AuthGuard } from '../guard/auth.guard';

export function Auth(...userRoles: UserRole[]) {
  return applyDecorators(
    SetMetadata('userRoles', userRoles),
    UseGuards(AuthGuard),
  );
}
