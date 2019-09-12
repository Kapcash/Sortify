import { Module, HttpModule } from '@nestjs/common';
import { SpotifyAuthService } from './spotify-auth/spotify-auth.service';
import { ConnectController } from './connect/connect.controller';
import { OauthModule } from './oauth/oauth.module';
import { OrmModule } from '../orm/orm.module';

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
