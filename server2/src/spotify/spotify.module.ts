import { Module, HttpModule } from '@nestjs/common';
import { SpotifyApiService } from './spotifyApi/spotifyApi.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SortifyUser } from '../models/user/sortifyUser.entity';
import { SpotifyController } from './spotify.controller';
import { OauthModule } from '../auth/oauth/oauth.module';
import { AuthModule } from '../auth/auth.module';
import { OrmModule } from '../orm/orm.module';

@Module({
  imports: [
    OauthModule,
    HttpModule,
    AuthModule,
    OrmModule,
    TypeOrmModule.forFeature([SortifyUser]),
  ],
  controllers: [SpotifyController],
  providers: [SpotifyApiService],
  exports: [SpotifyApiService],
})
export class SpotifyModule {}
