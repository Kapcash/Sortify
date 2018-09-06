import { Controller, Get, Logger, Res, Req, UseInterceptors } from '@nestjs/common';
import { AppService } from '../app.service';
import * as url from 'url';
import { LoggingInterceptor } from '../auth.interceptor';

@Controller('connect')
export class ConnectController {

  constructor(private readonly appService: AppService) {
  }

  /**
   * Redirect to the Spotify connexion page
   */
  @Get('/')
  public connect(@Req() req, @Res() res){
    Logger.log('GET connect');
    res.redirect(url.format({
      pathname: 'https://accounts.spotify.com/authorize',
      query: {
        response_type: 'code',
        client_id: this.appService.clientId,
        scope: this.appService.scopes,
        redirect_uri: this.appService.redirectURI,
        state: 'sortify',
      },
      }));
  }

  /**
   * Callback of an Oauth2 authentication flow
   * Get the oauth2 token from the 'code' retrieved
   * then redirect to the main web page
   */
  @Get('/signin')
  public signin(@Req() req, @Res() res){
    return this.appService.getToken(req.query.code);
  }

  /**
   * This route should be called only if logged once before
   * So a jwt should exists in the request and be parsed by the interceptor
   */
  @Get('refresh')
  @UseInterceptors(LoggingInterceptor)
  public refresh(@Req() req, @Res() res){
    this.appService.getToken(req.params.jwt.spotify_refresh_token).subscribe(
      (result) => {
        res.status(200).send(result);
      },
      (error) => {
        res.status(error.response.status).send(error.response);
      },
    );
  }

  /**
   * Callback of an Oauth2 authentication flow
   * Get the oauth2 token from the 'code' retrieved
   * then redirect to the main web page
   */
  @Get('/callback')
  public async callback(@Req() req, @Res() res){
    this.appService.getToken(req.query.code).subscribe(
      (jwt) => {
        res.redirect('http://localhost:8080/#/login?jwt=' + jwt);
      },
      (error) => {
        res.redirect('http://localhost:8080/#/login?error=' + error);
      });
  }

}
