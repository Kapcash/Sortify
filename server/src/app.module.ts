import { Module, HttpModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from 'nestjs-config';
import { AppController } from './app.controller';
import { AuthService } from './auth.service';
import { SortifyService } from './sortify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { ConnectController } from './connect/connect.controller';

@Module({
  imports: [HttpModule,
    JwtModule.register({ secretOrPrivateKey: 'sortify' }),
    ConfigModule.load()],
  controllers: [AppController, SpotifyController, ConnectController],
  providers: [AuthService, SortifyService],
})
export class AppModule implements NestModule{
  configure(consumer: MiddlewareConsumer){
    // consumer.apply(AuthMiddleware).forRoutes({ path: 'connect', method: RequestMethod.GET });
  }
}
