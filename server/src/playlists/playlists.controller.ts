import { Controller, Get } from '@nestjs/common';

@Controller('playlists')
export class PlaylistsController {
  @Get()
  findAll() {
    return 'This action returns all playlists';
  }
}
