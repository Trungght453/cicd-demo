import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';

// The env matrix lives in app.service.spec.ts. This file only checks that the
// controller is wired to the service and hands its result back untouched.
describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: {
            getHealth: () => ({
              status: 'ok',
              version: '9.9.9',
              commit: 'deadbee',
            }),
          },
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('returns what the service returns, unchanged', () => {
    expect(appController.getHealth()).toEqual({
      status: 'ok',
      version: '9.9.9',
      commit: 'deadbee',
    });
  });
});
