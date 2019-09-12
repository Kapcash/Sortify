import { Controller, Get, UseGuards, UseInterceptors } from '@nestjs/common';
import { LoggingGuard } from '../auth/logging.guard';
import { SpotifyApiService } from './spotifyApi/spotifyApi.service';
import { SpotifyJwtInterceptor } from '../spotify-jwt.interceptor';

@Controller('spotify')
@UseGuards(LoggingGuard)
@UseInterceptors(SpotifyJwtInterceptor)
export class SpotifyController {

  constructor(private readonly spotifyService: SpotifyApiService) {}

  /**
   * @param jwt The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   * @param user The spotify user used to filter playlists
   */
/*   @Post('/init')
  initializeApp(@Param('jwt') jwt: SortifyJwt, @User() user: SortifyUser) {
    return this.spotifyService.initializeTracksMaps(user, jwt);
  } */

  @Get('/me')
  getUserInfos() {
    return this.spotifyService.getUserInfosFromDb(null); // TODO
  }

 /*  @Post('/tracks')
  getTracks(@User() user: SortifyUser, @Query('playlistId') playlistId: string) {
    return this.spotifyService.getTracksOfPlaylist(user.href, playlistId);
  } */
/*
  @Post('/playlists')
  getPlaylists(@User() user: SortifyUser) {
    return this.spotifyService.getPlaylists(user.href);
  } */

  /**
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   */
 /*  @Post('/unsorted-tracks')
  getUnsortedTracks(@Param('jwt') jwt: SortifyJwt, @User() user: SortifyUser) {
    return this.spotifyService.getUnsortedTracks(user, jwt);
  } */

  /**
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   */
 /*  @Post('/clean-tracks')
  cleanTracks(@Body('sortedTracks') sortedTracks: any, @Body('sortedTracks') sortifyTrashed: any) {
    return this.spotifyService.cleanTracks(sortedTracks, sortifyTrashed);
  } */
}
