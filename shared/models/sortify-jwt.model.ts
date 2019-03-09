import { SpotifyUser } from "models/spotifyUser";

export interface SortifyJwt {
  spotify_token: string;
  expires_in: number;
  spotify_refresh_token: string;
  iat: number;
  payload: {
    user: SpotifyUser
  }
}