import express = require('express');
import * as url from 'url';
import { Controller, Get, Logger, Res, Req, UseInterceptors, Param, Query, UseGuards, Body } from '@nestjs/common';
import { SortifyJwt } from '../../models/jwt/sortify-jwt.model';
import { AUTH_REDIRECT_URI, LOGIN_REDIRECT, SPOTIFY_AUTH_URL } from '../../constants';
import { ConfigService } from '../../config/config.service';
import { SpotifyAuthService } from '../spotify-auth/spotify-auth.service';
import { LoggingGuard } from '../logging.guard';
import { OauthService } from '../oauth/oauth.service';

@Controller('connect')
export class ConnectController {

  constructor(private config: ConfigService, private oauthService: OauthService, private readonly authService: SpotifyAuthService) {
  }

  /**
   * Redirect to the Spotify connexion page
   */
  @Get('/')
  public connect(@Res() res: express.Response) {
    Logger.log('GET connect');
    const authUrl = url.format({
      pathname: SPOTIFY_AUTH_URL,
      query: {
        response_type: 'code',
        client_id: this.config.clientId,
        scope: this.config.scopes,
        redirect_uri: AUTH_REDIRECT_URI(this.config.serverPort),
        state: 'sortify',
      },
    });
    Logger.log(authUrl.toString());
    res.redirect(authUrl);
  }

  /**
   * Callback of an Oauth2 authentication flow
   * Get the oauth2 token from the 'code' retrieved
   * then redirect to the main web page
   */
  @Get('/signin')
  public signin(@Req() req: express.Request) {
    return this.authService.getToken(req.query.code);
  }

  /**
   * Technical endpoint to forge a custom jwt
   */
  @Get('/jwt')
  public async forgeJwt(@Body() jwtBody: SortifyJwt) {
    return this.oauthService.signJwt(jwtBody);
  }

  /**
   * Technical endpoint to forge a custom jwt
   */
  @Get('/test')
  @UseGuards(LoggingGuard)
  public async test(@Req() req) {
    await this.authService.getToken(undefined);
    return 'hello';
  }

  /**
   * This route should be called only if logged once before
   * So a jwt should exists in the request and be parsed by the interceptor
   */
  @Get('refresh')
  @UseGuards(LoggingGuard)
  public refresh(@Param('jwt') jwt: SortifyJwt) {
    return this.authService.getToken(jwt.spotifyRefreshToken, true);
  }

  /**
   * Callback of an Oauth2 authentication flow
   * Get the oauth2 token from the 'code' retrieved
   * then redirect to the main web page
   */
  @Get('/callback')
  public async callback(@Query('code') code: string, @Res() res: express.Response) {
    return this.authService.getToken(code).subscribe(
      (jwt) => {
        res.redirect(`${LOGIN_REDIRECT}?jwt=${jwt}`);
      },
      (error) => {
        res.redirect(`${LOGIN_REDIRECT}?error=${error}`);
      });
  }

}
