import { Test, TestingModule } from '@nestjs/testing';
import { PlaylistsController } from './playlists.controller';

describe('Playlists Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [PlaylistsController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: PlaylistsController = module.get<PlaylistsController>(PlaylistsController);
    expect(controller).toBeDefined();
  });
});
