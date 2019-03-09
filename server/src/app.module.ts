import { Module, HttpModule, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AuthService } from './auth.service';
import { SortifyService } from './sortify.service';
import { SpotifyController } from './spotify/spotify.controller';
import { ConnectController } from './connect/connect.controller';
import { UserSchema } from './models/user.schema';
import { PlaylistSchema } from './models/playlist.schema';
import { TrackSchema } from './models/track.schema';
import { MongooseConfigService } from './mongooseConfig.service';
import { ConfigModule } from './config.module';

const mongooseEntities = [
  { name: 'User', schema: UserSchema },
  { name: 'Playlist', schema: PlaylistSchema },
  { name: 'Track', schema: TrackSchema },
]

@Module({
  imports: [
    ConfigModule,
    HttpModule,
    JwtModule.register({ secretOrPrivateKey: 'sortify' }),
    MongooseModule.forRootAsync({
      useClass: MongooseConfigService,
    }),
    MongooseModule.forFeature(mongooseEntities)
  ],
  controllers: [AppController, SpotifyController, ConnectController],
  providers: [AuthService, SortifyService],
})
export class AppModule implements NestModule {
  configure(){}
}
