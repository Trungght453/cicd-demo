import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types.js';
import { AppModule } from './../src/app.module.js';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    await app.close();
  });

  it('GET /health returns 200 and JSON', () => {
    return request(app.getHttpServer())
      .get('/health')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((res) => {
        expect(res.body.status).toBe('ok');
        expect(typeof res.body.version).toBe('string');
        expect(typeof res.body.commit).toBe('string');
      });
  });

  it('GET /hello returns 200 and a message, whatever it says', () => {
    // Deliberately does not assert the wording. The greeting is copy, and copy
    // is meant to be edited without asking a pipeline for permission. What is
    // asserted is the shape a caller depends on.
    return request(app.getHttpServer())
      .get('/hello')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .expect((res) => {
        expect(typeof res.body.message).toBe('string');
        expect(res.body.message.length).toBeGreaterThan(0);
      });
  });

  it('GET / is not routed', () => {
    // /health and /hello are the only endpoints. If this ever returns 200
    // someone has added a route without saying so.
    return request(app.getHttpServer()).get('/').expect(404);
  });
});
