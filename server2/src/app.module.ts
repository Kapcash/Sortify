import { Module, Global, HttpModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AuthModule } from './auth/auth.module';
import { TypeOrmConfigService } from './typeOrmConfig.service';
import { ConfigModule } from './config/config.module';
import { SpotifyModule } from './spotify/spotify.module';
import { OauthModule } from './auth/oauth/oauth.module';
import { OrmModule } from './orm/orm.module';

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
  providers: [],
})
export class AppModule {}
