import { Injectable, NestInterceptor, ExecutionContext, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import axios from 'axios';
import { map } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {

  constructor(private readonly authService: AuthService){}

  intercept(
    context: ExecutionContext,
    call$: Observable<any>,
  ): Observable<any> {
    const httpRequest = context.getArgByIndex(0);
    const httpResponse = context.getArgByIndex(1);
    
    // Comes from an http request, to '/spotify' endpoints
    if (httpRequest.protocol === 'http' || 'https') {
      const signedJwt = httpRequest.headers.authorization.replace('Bearer ', '');
      httpRequest.params.jwt = this.authService.decodeJwt(signedJwt);
    }
    return call$;
  }
}
