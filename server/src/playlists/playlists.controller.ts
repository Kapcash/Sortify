import { Controller, Get, Logger } from '@nestjs/common';

@Controller('playlists')
export class PlaylistsController {
  @Get()
  findAll() {
    Logger.log('GET playlists');
    return 'This action returns all playlists';
  }
}
