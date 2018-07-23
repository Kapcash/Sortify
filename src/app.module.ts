import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PlaylistsController } from './playlists/playlists.controller';

@Module({
  imports: [],
  controllers: [AppController, PlaylistsController],
  providers: [AppService],
})
export class AppModule {}
