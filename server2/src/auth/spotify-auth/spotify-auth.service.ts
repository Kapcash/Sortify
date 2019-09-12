import { Injectable, HttpService, HttpException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { flatMap, map, catchError } from 'rxjs/operators';
import * as querystring from 'querystring';
import { OauthService } from '../oauth/oauth.service';
import { ConfigService } from '../../config/config.service';
import { SpotifyJwt } from '../../models/jwt/spotify-jwt.model';
import { AUTH_REDIRECT_URI, SPOTIFY_ACCOUNT_API_URL, SPOTIFY_API_URL } from '../../constants';
import { SortifyUser } from '../../models/user/sortifyUser.entity';
import { SpotifyUser } from '../../models/user/spotifyUser';
import { SpotifyDbService } from '../../orm/spotify-db/spotify-db.service';

@Injectable()
export class SpotifyAuthService {

  constructor(
    private readonly httpService: HttpService,
    private readonly oauthService: OauthService,
    private readonly config: ConfigService,
    private readonly spotifyDbService: SpotifyDbService) {
    }

  /**
   * Get a Spotify JWT token and generated a new one including the spotify token and user informations.
   * @param spotifyCode The oauth code returned by the spotify api
   * @param refreshing If wether we want to refresh an existing token or not
   */
  getToken(spotifyCode: string, refreshing: boolean = false): Observable<string> {
    let tokenBody: any;
    if (refreshing) {
      // Refresh Token
      tokenBody = querystring.stringify({
        grant_type: 'refresh_token',
        refresh_token: spotifyCode,
      });
    } else {
      // Auth token
      tokenBody = querystring.stringify({
        grant_type: 'authorization_code',
        code: spotifyCode,
        redirect_uri: AUTH_REDIRECT_URI(this.config.serverPort), // Used only for security, not for redirect
      });
    }

    return this.httpService.post(`${SPOTIFY_ACCOUNT_API_URL}/token`, tokenBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(this.config.clientId + ':' + this.config.clientSecret).toString('base64'),
      },
    }).pipe(
      flatMap(async res => {
        const spotifyAuth: SpotifyJwt = res.data;
        const spotifyUser: SortifyUser = await this.getUserInfos(spotifyAuth.access_token).toPromise();
        return this.oauthService.signJwt(
          this.oauthService.buildJwt(spotifyAuth.access_token,
                    spotifyAuth.expires_in,
                    spotifyAuth.refresh_token,
                    spotifyUser.id));
      }),
    );
  }

  public refreshToken(spotifyRefreshCode: string): Observable<string>  {
    return this.getToken(spotifyRefreshCode, true);
  }

  /**
   * Get the spotify user informations
   * @param spotifyJwt The jwt from spotify
   * @see SpotifyUser Type model
   */
  getUserInfos(spotifyJwt: string): Observable<SortifyUser> {
    return this.httpService.get(
      `${SPOTIFY_API_URL}/me`,
      { headers: { Authorization: 'Bearer ' + spotifyJwt } },
    ).pipe(
      map((res) => {
        const spotifyUser: SpotifyApi.UserObjectPrivate = res.data;
        const sortifyUser: SortifyUser = new SpotifyUser(spotifyUser);
        this.spotifyDbService.saveUser(sortifyUser);
        return sortifyUser;
      }),
      catchError((error) => {
        throw new HttpException(error.message, error.response.status);
      }),
    );
  }
}
