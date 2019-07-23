import { Controller, Get, Logger, Res, Req, UseInterceptors, Param, Query } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { LoggingInterceptor } from '../auth.interceptor';
import * as url from 'url';
import express = require('express');
import { SortifyJwt } from '../models/sortify-jwt.model';

@Controller('connect')
export class ConnectController {

  constructor(private readonly authService: AuthService) {
  }

  /**
   * Redirect to the Spotify connexion page
   */
  @Get('/')
  public connect(@Res() res: express.Response){
    Logger.log('GET connect');
    res.redirect(url.format({
      pathname: 'https://accounts.spotify.com/authorize',
      query: {
        response_type: 'code',
        client_id: this.authService.clientId,
        scope: this.authService.scopes,
        redirect_uri: this.authService.redirectURI,
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
  public signin(@Req() req: express.Request){
    return this.authService.getToken(req.query.code);
  }

  /**
   * This route should be called only if logged once before
   * So a jwt should exists in the request and be parsed by the interceptor
   */
  @Get('refresh')
  @UseInterceptors(LoggingInterceptor)
  public refresh(@Param('jwt') jwt: SortifyJwt){
    return this.authService.getToken(jwt.spotify_refresh_token, true);
  }

  /**
   * Callback of an Oauth2 authentication flow
   * Get the oauth2 token from the 'code' retrieved
   * then redirect to the main web page
   */
  @Get('/callback')
  public async callback(@Query('code') code: string, @Res() res: express.Response){
    return this.authService.getToken(code).subscribe(
      (jwt) => {
        res.redirect('http://localhost:8080/#/login?jwt=' + jwt);
      },
      (error) => {
        res.redirect('http://localhost:8080/#/login?error=' + error);
      });
  }

}
