import { SpotifyJwtInterceptor } from './spotify-jwt.interceptor';

describe('SpotifyJwtInterceptor', () => {
  it('should be defined', () => {
    expect(new SpotifyJwtInterceptor()).toBeDefined();
  });
});
