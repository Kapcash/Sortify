import { Test, TestingModule } from '@nestjs/testing';
import { SpotifyDbService } from './spotify-db.service';

describe('SpotifyDbService', () => {
  let service: SpotifyDbService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpotifyDbService],
    }).compile();

    service = module.get<SpotifyDbService>(SpotifyDbService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
