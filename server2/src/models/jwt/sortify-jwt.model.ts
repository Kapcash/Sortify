/**
 * Model of the app jwt
 */
export class SortifyJwt {
  spotifyToken: string;
  expiresIn: number;
  exp: number;
  spotifyRefreshToken: string;
  userId: string;

  constructor(spotifyToken: string, expiresIn: number, spotifyRefreshToken: string, iat: number, userId: string) {
    this.spotifyToken = spotifyToken;
    this.expiresIn = expiresIn;
    this.spotifyRefreshToken = spotifyRefreshToken;
    this.userId = userId;
  }
}
