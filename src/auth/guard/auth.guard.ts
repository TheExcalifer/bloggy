import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private jwtService: JwtService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const userRoles: [string] = this.reflector.get(
      'userRoles',
      context.getHandler(),
    );

    const request = context.switchToHttp().getRequest();

    const token = this.extractTokenFromHeader(request);

    try {
      const paylaod = this.jwtService.verify(token);

      if (!userRoles.includes(paylaod.role)) return false;

      request.user = paylaod;
      return true;
    } catch (error) {
      return false;
    }
  }
  private extractTokenFromHeader(request: Request): string | undefined {
    const headers: any = request.headers;
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
