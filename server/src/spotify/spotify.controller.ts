import { Controller, Get, Logger, Req, UseInterceptors, Res } from '@nestjs/common';
import { SortifyService } from '../sortify.service';
import { LoggingInterceptor } from '../auth.interceptor';

@Controller('spotify')
@UseInterceptors(LoggingInterceptor)
export class SpotifyController {

  constructor(private readonly sortifyService: SortifyService){}

  @Get('/me')
  getUserInfos(@Req() req, @Res() res) {
    this.sortifyService.getUserInfos(req).subscribe(
      (result) => {
        res.status(200).send(result);
      },
      (error) => {
        res.status(401).send(error.response.data);
      },
    );
  }

  @Get('/unsorted-tracks')
  getUnsortedTracks(@Req() req, @Res() res) {
    this.sortifyService.getUnsortedTracks(req).subscribe();
  }
}
