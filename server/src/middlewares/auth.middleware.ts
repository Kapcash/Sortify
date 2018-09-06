import { Injectable, NestMiddleware, MiddlewareFunction } from '@nestjs/common';
import { AppService } from '../app.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {

  constructor(public readonly authService: AppService){

  }

  resolve(...args: any[]): MiddlewareFunction {
    return (req, res, next) => {
      // TODO: stuff
      next();
    };
  }
}