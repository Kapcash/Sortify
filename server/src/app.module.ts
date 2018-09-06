import { Module, HttpModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'nestjs-config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SpotifyController } from './spotify/spotify.controller';
import { ConnectController } from './connect/connect.controller';
import * as path from 'path';

@Module({
  imports: [HttpModule,
    JwtModule.register({ secretOrPrivateKey: 'sortify' }),
    ConfigModule.load()],
  controllers: [AppController, SpotifyController, ConnectController],
  providers: [AppService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    // consumer.apply(AuthMiddleware).forRoutes({ path: 'connect', method: RequestMethod.GET });
  }
}
