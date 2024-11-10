import { Test, TestingModule } from '@nestjs/testing';
import { PostagensService } from './postagens.service';

describe('PostagensService', () => {
  let service: PostagensService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostagensService],
    }).compile();

    service = module.get<PostagensService>(PostagensService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
