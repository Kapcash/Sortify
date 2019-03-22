import { SpotifyUser } from './spotifyUser';

export interface SortifyJwt {
  spotify_token: string;
  expires_in: number;
  spotify_refresh_token: string;
  iat: number;
  payload: {
    user: SpotifyUser,
  };
}

export function buildJwt(spotify_token: string,
                          expires_in: number,
                          spotify_refresh_token: string,
                          iat: number,
                          user: SpotifyUser): SortifyJwt {
  return { spotify_token, expires_in, spotify_refresh_token, iat, payload: { user } };
}