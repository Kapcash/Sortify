import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { SortifyJwt } from '../models/jwt/sortify-jwt.model';
import { OauthService } from './oauth/oauth.service';
import { TokenExpiredError } from 'jsonwebtoken';
import { SpotifyAuthService } from './spotify-auth/spotify-auth.service';
import { SpotifyDbService } from '../orm/spotify-db/spotify-db.service';

@Injectable()
export class LoggingGuard implements CanActivate {

  constructor(private readonly oauthService: OauthService,
              private readonly authService: SpotifyAuthService,
              private readonly spotifyDbService: SpotifyDbService) {
  }

  async canActivate(
    context: ExecutionContext,
  ): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const signedJwt = request.headers.authorization.replace('Bearer ', '');

    return this.getDecodedJwt(signedJwt).then(async (jwt: SortifyJwt) => {
      request.user = await this.spotifyDbService.getUser(jwt.userId);
      request.jwt = jwt;
      return true;
    }).catch(e => false);
  }

  private async getDecodedJwt(signedJwt: string): Promise<SortifyJwt> {
    let decodedJwt: SortifyJwt;
    try {
      decodedJwt = this.oauthService.verifyJwt(signedJwt);
    } catch (err) {
      if (err instanceof TokenExpiredError) {
        const decodedInvalidJwt: SortifyJwt = this.oauthService.decodeJwt(signedJwt);
        if (decodedInvalidJwt && decodedInvalidJwt.spotifyRefreshToken) {
          const refreshedJwt = await this.authService.refreshToken(decodedInvalidJwt.spotifyRefreshToken).toPromise();
          return this.getDecodedJwt(refreshedJwt);
        }
      }
      throw err;
    }
    return decodedJwt;
  }
}
