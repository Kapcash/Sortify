import { Controller, Get, UseInterceptors, Post, Param, Body } from '@nestjs/common';
import { SortifyService } from '../sortify.service';
import { LoggingInterceptor } from '../auth.interceptor';
import { User } from '../user.decorator';
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
  initializeApp(@Param('jwt') jwt: SortifyJwt, @User() user: SpotifyApi.UserProfileResponse){
    return this.sortifyService.initializeTracksMaps(user, jwt);
  }

  @Get('/me')
  getUserInfos(@Param('jwt') jwt: SortifyJwt) {
    return this.sortifyService.getUserInfos(jwt);
  }

  /**
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   */
  @Post('/unsorted-tracks')
  getUnsortedTracks(@Body('sortedTracks') sortedTracks: any, @Body('savedTracks') savedTracks: string[]) {
    return this.sortifyService.getUnsortedTracks(sortedTracks, savedTracks);
  }
}
