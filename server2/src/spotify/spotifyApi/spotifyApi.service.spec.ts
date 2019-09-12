import { Test, TestingModule } from 'src/spotify/spotifyApi/node_modules/@nestjs/testing';
import { SpotifyApiService } from './spotifyApi.service';

describe('SpotifyapiService', () => {
  let service: SpotifyApiService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyApiService],
    }).compile();

    service = module.get<SpotifyApiService>(SpotifyApiService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
