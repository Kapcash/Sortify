import { Module, Global, HttpModule, UseInterceptors } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './typeOrmConfig.service';
import { ConfigModule } from './config/config.module';
import { SpotifyModule } from './spotify/spotify.module';
import { OauthModule } from './auth/oauth/oauth.module';
import { SpotifyJwtInterceptor } from './spotify-jwt.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

@Global()
@Module({
  imports: [
    HttpModule,
    ConfigModule,
    AuthModule,
    OauthModule,
    SpotifyModule,
    TypeOrmModule.forRootAsync({
      useClass: TypeOrmConfigService,
    }),
  ],
  controllers: [AppController],
  providers: [{
    provide: APP_INTERCEPTOR,
    useClass: SpotifyJwtInterceptor,
  }],
})
export class AppModule {}
