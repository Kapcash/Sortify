import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(){}

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      // TODO: stuff
      next();
    };
  }
}