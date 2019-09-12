import { Test, TestingModule } from '@nestjs/testing';
import { ConnectController } from './connect.controller';

describe('Connect Controller', () => {
  let module: TestingModule;
  beforeAll(async () => {
    module = await Test.createTestingModule({
      controllers: [ConnectController],
    }).compile();
  });
  it('should be defined', () => {
    const controller: ConnectController = module.get<ConnectController>(ConnectController);
    expect(controller).toBeDefined();
  });
});
