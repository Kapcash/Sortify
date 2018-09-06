import { Injectable, HttpService, Logger, UseInterceptors } from '@nestjs/common';
import formurlencoded from 'form-urlencoded';
import { JwtService } from '@nestjs/jwt';
import { map } from 'rxjs/operators';
import { SpotifyUser } from './models/spotifyUser';
import { ConfigService } from 'nestjs-config';
import { Observable } from 'rxjs';
import { AxiosResponse } from 'axios';

@Injectable()
export class AppService {

  private clientSecret: string;
  public clientId: string;
  public scopes: string;
  public redirectURI: string = 'http://localhost:3000/connect/callback';

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService){
      // Initialize spotify api values from local config
      this.clientId = this.config.get('default.client_id');
      this.clientSecret = this.config.get('default.client_secret');
      this.scopes = this.config.get('default.scopes');
    }

  // === Authentication === //

  getToken(spotifyCode: string): Observable<string>{
    return this.httpService.post('https://accounts.spotify.com/api/token', formurlencoded({
      grant_type: 'authorization_code',
      code: spotifyCode,
      redirect_uri: this.redirectURI, // Used only for security, not for redirect
    }), {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
      },
    }).pipe(
      map(res => {
        const spotifyAuth = res.data;
        return this.jwtService.sign({
          spotify_token: spotifyAuth.access_token,
          expires_in: spotifyAuth.expires_in,
          spotify_refresh_token: spotifyAuth.refresh_token,
        });
      }),
    );
  }

  verifyJwt(jwt: string): any {
    return this.jwtService.verify(jwt);
  }

  decodeJwt(jwt: string): any {
    return this.jwtService.decode(jwt, {json: true});
  }

  // ====================== //

  // === Spotify Api functions === //

  createPlaylist(): string {
    return 'Creating playlist';
  }

  getUserInfos(req): Observable<SpotifyUser> {
    return this.httpService.get('https://api.spotify.com/v1/me', {
      headers: {
        Authorization: 'Bearer ' + req.params.jwt.spotify_token,
      },
    }).pipe(
      map((res) => {
        return new SpotifyUser(res.data);
      }),
    );
  }

  // ============================ //
}
