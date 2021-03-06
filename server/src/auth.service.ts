import { Injectable, HttpService, Logger, UseInterceptors } from '@nestjs/common';
import formurlencoded from 'form-urlencoded';
import { JwtService } from '@nestjs/jwt';
import { map } from 'rxjs/operators';
import { ConfigService } from './config.service';
import { Observable } from 'rxjs';
import { SortifyJwt, buildJwt } from './models/sortify-jwt.model';
import { SortifyService } from 'sortify.service';

@Injectable()
export class AuthService {

  private clientSecret: string;
  public clientId: string;
  public scopes: string;
  public redirectURI: string = 'http://localhost:3000/connect/callback';

  constructor(
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
    private readonly spotifyService: SortifyService) {
      // Initialize spotify api values from local config
      this.clientId = this.config.get('client_id');
      this.clientSecret = this.config.get('client_secret');
      this.scopes = this.config.get('scopes');
    }

  getToken(spotifyCode: string, refreshing: boolean = false): Observable<string>{
    let tokenBody: any;
    if (refreshing) {
      // Refresh Token
      tokenBody = formurlencoded({ // TODO: Change to use https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format
        grant_type: 'refresh_token',
        refresh_token: spotifyCode,
      });
    } else {
      // Auth token
      tokenBody = formurlencoded({
        grant_type: 'authorization_code',
        code: spotifyCode,
        redirect_uri: this.redirectURI, // Used only for security, not for redirect
      });
    }

    return this.httpService.post('https://accounts.spotify.com/api/token', tokenBody, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Accept': 'application/json',
        'Authorization': 'Basic ' + Buffer.from(this.clientId + ':' + this.clientSecret).toString('base64'),
      },
    }).pipe(
      map(res => {
        const spotifyAuth = res.data;
        this.spotifyService.getUserInfos()
        return this.jwtService.sign(
          buildJwt(spotifyAuth.access_token,
                    spotifyAuth.expires_in,
                    spotifyAuth.refresh_token,
                    0,
                    undefined));
      }),
    );
  }

  verifyJwt(jwt: string): any {
    return this.jwtService.verify(jwt);
  }

  decodeJwt(jwt: string): SortifyJwt {
    return this.jwtService.decode(jwt, {json: true}) as SortifyJwt;
  }
}
