import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  constructor(private readonly authService: AuthService){}

  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const httpRequest = context.args[0];
    // const httpResponse = context.args[1];
    
    // Comes from an http request, to '/spotify' endpoints
    if (httpRequest.protocol === 'http') {
      const signedJwt = httpRequest.headers.authorization.replace('Bearer ', '');
      httpRequest.params.jwt = this.authService.decodeJwt(signedJwt);

      return call$;
    }

  }
}