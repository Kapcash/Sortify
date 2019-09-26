import { Module, HttpModule } from '@nestjs/common';
import { SpotifyAuthService } from './spotify-auth/spotify-auth.service';
import { ConnectController } from './connect/connect.controller';
import { OauthModule } from './oauth/oauth.module';
import { OrmModule } from '../orm/orm.module';

/**
 * Add the Authorization header with a given token to the given entry object
 * @param token Jwt token to add in the header
 */
export const addAuthHeader = (token: string, headers: any = {}) => {
  headers.Authorization = 'Bearer ' + token;
  return headers;
};

@Module({
  imports: [
    OauthModule,
    HttpModule,
    OrmModule,
  ],
  providers: [SpotifyAuthService],
  controllers: [ConnectController],
  exports: [SpotifyAuthService],
})
export class AuthModule {}
