import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpService } from '@nestjs/common';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { addAuthHeader } from './auth/auth.module';
import { AxiosRequestConfig } from 'axios';
import { SPOTIFY_API_URL } from './constants';

/**
 * Intercept incoming request in order to add the spotify jwt to all api calls
 */
@Injectable()
export class SpotifyJwtInterceptor implements NestInterceptor {

  constructor(private readonly httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request: any = context.getArgByIndex(0);
    let interceptorId: number = -1;
    if (request.jwt) {
      // Get the spotify token included inside the sortify jwt
      const spotifyJwt: string = request.jwt.spotifyToken;

      interceptorId = this.httpService.axiosRef.interceptors.request.use((req: AxiosRequestConfig) => {
        if (req.url.includes(SPOTIFY_API_URL)) {
          addAuthHeader(spotifyJwt, req.headers);
        }
        return req;
      });
    }
    return next.handle().pipe(
      finalize(() => {
        this.httpService.axiosRef.interceptors.request.eject(interceptorId);
      }),
    );
  }
}
