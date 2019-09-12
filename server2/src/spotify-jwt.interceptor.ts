import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { SortifyJwt } from './models/jwt/sortify-jwt.model';
import { tap } from 'rxjs/operators';

@Injectable()
export class SpotifyJwtInterceptor implements NestInterceptor {

  constructor(private readonly httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.getArgByIndex(0);
    let interceptorId: number = -1;
    if (request.jwt) {
      const spotifyJwt: string = request.jwt.spotifyToken;

      interceptorId = this.httpService.axiosRef.interceptors.request.use(req => {
        // TODO add jwt to all spotify api calls
        console.log("HERE")
        req.headers.authentication = spotifyJwt;
        return req;
      });
    }
    return next.handle().pipe(
      tap(() => {
        console.log("test");
        this.httpService.axiosRef.interceptors.request.eject(interceptorId) 
      }),
    );
  }
}
