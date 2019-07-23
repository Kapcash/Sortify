import { Module, HttpModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthService } from './auth.service';
import { SortifyService } from './sortify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { ConnectController } from './connect/connect.controller';
import { MongooseConfigService } from './mongooseConfig.service';
import { ConfigModule } from './config.module';

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.register({ secretOrPrivateKey: 'sortify' }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
  ],
  controllers: [AppController, SpotifyController, ConnectController],
  providers: [AuthService, SortifyService],
})
export class AppModule implements NestModule {
  configure(){}
}
