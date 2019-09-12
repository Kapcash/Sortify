import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SortifyJwt } from '../../models/jwt/sortify-jwt.model';

@Injectable()
export class OauthService {

  constructor(private jwtService: JwtService) { }

  buildJwt(
    spotifyToken: string,
    expiresIn: number,
    spotifyRefreshToken: string,
    user: string): SortifyJwt {
    return new SortifyJwt(spotifyToken, expiresIn, spotifyRefreshToken, Date.now(), user);
  }

  signJwt(jwtObj: SortifyJwt): string {
    // jwtObj.exp = Math.floor(Date.now() / 1000) + jwtObj.expiresIn;
    return this.jwtService.sign(Object.assign({}, jwtObj), {expiresIn: jwtObj.expiresIn});
  }

  verifyJwt(jwt: string): SortifyJwt {
    return this.jwtService.verify(jwt);
  }

  decodeJwt(jwt: string): SortifyJwt {
    return this.jwtService.decode(jwt, { json: true }) as SortifyJwt;
  }
}
