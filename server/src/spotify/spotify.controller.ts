import { Controller, Get, UseInterceptors, Post, Param, Body, Query } from '@nestjs/common';
import { SortifyService } from '../sortify.service';
import { LoggingInterceptor } from '../auth.interceptor';
import { User } from '../user.decorator';
import { SortifyUser } from '../models/user.interface';
import { SortifyJwt } from '../../../shared/models/sortify-jwt.model';

@Controller('spotify')
@UseInterceptors(LoggingInterceptor)
export class SpotifyController {

  constructor(private readonly sortifyService: SortifyService){}

  /**
   * 
   * @param jwt The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   * @param user The spotify user used to filter playlists
   */
  @Post('/init')
  initializeApp(@Param('jwt') jwt: SortifyJwt, @User() user: SortifyUser) {
    return this.sortifyService.initializeTracksMaps(user, jwt);
  }

  @Get('/me')
  getUserInfos(@Param('jwt') jwt: SortifyJwt) {
    return this.sortifyService.getUserInfos(jwt);
  }

  @Post('/tracks')
  getTracks(@User() user: SortifyUser, @Query('playlistId') playlistId: string) {
    return this.sortifyService.getTracksOfPlaylist(user.href, playlistId);
  }

  @Post('/playlists')
  getPlaylists(@User() user: SortifyUser) {
    return this.sortifyService.getPlaylists(user.href);
  }

  /**
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   */
  @Post('/unsorted-tracks')
  getUnsortedTracks(@Param('jwt') jwt: SortifyJwt, @User() user: SortifyUser) {
    return this.sortifyService.getUnsortedTracks(user, jwt);
  }

  /**
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   */
  @Post('/clean-tracks')
  cleanTracks(@Body('sortedTracks') sortedTracks: any, @Body('sortedTracks') sortifyTrashed: any) {
    return this.sortifyService.cleanTracks(sortedTracks, sortifyTrashed);
  }
}
