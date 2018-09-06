import { Controller, Get, Logger, Req, UseInterceptors, Res } from '@nestjs/common';
import { AppService } from '../app.service';
import { LoggingInterceptor } from '../auth.interceptor';

@Controller('spotify')
@UseInterceptors(LoggingInterceptor)
export class SpotifyController {

  constructor(private readonly appService: AppService){}

  @Get('/me')
  getUserInfos(@Req() req, @Res() res) {
    this.appService.getUserInfos(req).subscribe(
      (result) => {
        res.status(200).send(result);
      },
      (error) => {
        res.send(401);
      },
    );
  }
}
