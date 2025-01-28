import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthEntity } from './auth.entity';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): AuthEntity => {
    const req = ctx.switchToHttp().getRequest();
    return req.user;
  },
);
