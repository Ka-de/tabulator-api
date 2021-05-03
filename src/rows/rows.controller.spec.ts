import { Test, TestingModule } from '@nestjs/testing';
import { RowsController } from './rows.controller';

describe('RowsController', () => {
  let controller: RowsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RowsController],
    }).compile();

    controller = module.get<RowsController>(RowsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
