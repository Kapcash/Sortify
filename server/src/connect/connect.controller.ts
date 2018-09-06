import { Controller, Get, Logger, Res, Req } from '@nestjs/common';
import { AppService } from '../app.service';
import * as url from 'url';

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
  public async signin(@Req() req, @Res() res){
    return this.appService.getToken(req.query.code);
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
