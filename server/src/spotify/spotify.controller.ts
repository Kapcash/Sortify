import { Controller, Get, Logger, Req, UseInterceptors, Res, Post, Param } from '@nestjs/common';
import { SortifyService } from '../sortify.service';
import { LoggingInterceptor } from '../auth.interceptor';
import { User } from '../user.decorator';
import { map } from 'rxjs/operators';

@Controller('spotify')
@UseInterceptors(LoggingInterceptor)
export class SpotifyController {

  constructor(private readonly sortifyService: SortifyService){}

  /**
   * 
   * @param req The incoming request from client side. It requires the body to contain sortedTracks:
   *            Map<string, Array<string>> and savedTracks: Array<string>
   * @param res 
   */
  @Post('/init')
  initializeApp(@Param('jwt') jwt, @User() user){
    return this.sortifyService.initializeTracksMaps(user, jwt).pipe(
      map(
        (res) => {
          console.log(res);
          return res;
        }
      )
    );
  }

  @Get('/me')
  getUserInfos(@Param('jwt') jwt) {
    return this.sortifyService.getUserInfos(jwt).pipe(
      map(
        (result: SpotifyApi.UserProfileResponse) => result,
        (error) => error.response.data.error,
      )
    );
  }

  @Post('/unsorted-tracks')
  getUnsortedTracks(@Req() req) {
    return this.sortifyService.getUnsortedTracks(req.body.sortedTracks, req.body.savedTracks).pipe(
      map(
        (result) => result,
        (error) => error.response.data.error,
      )
    );
  }
}
