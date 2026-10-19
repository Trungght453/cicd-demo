import { AppService } from './app.service.js';

describe('AppService', () => {
  let service: AppService;
  let saved: { version?: string; commit?: string };

  beforeEach(() => {
    service = new AppService();
    // These tests write to process.env, which is shared across the whole run.
    // Save and restore so one case cannot leak into the next or into any other
    // file vitest happens to run in the same worker.
    saved = { version: process.env.APP_VERSION, commit: process.env.GIT_SHA };
    delete process.env.APP_VERSION;
    delete process.env.GIT_SHA;
  });

  afterEach(() => {
    if (saved.version === undefined) delete process.env.APP_VERSION;
    else process.env.APP_VERSION = saved.version;

    if (saved.commit === undefined) delete process.env.GIT_SHA;
    else process.env.GIT_SHA = saved.commit;
  });

  it('always reports ok', () => {
    expect(service.getHealth().status).toBe('ok');
  });

  it('falls back to dev/local when the build stamped nothing', () => {
    expect(service.getHealth()).toEqual({
      status: 'ok',
      version: 'dev',
      commit: 'local',
    });
  });

  it('reports exactly what the build stamped', () => {
    process.env.APP_VERSION = '1.4.0';
    process.env.GIT_SHA = 'a3f9c21';

    expect(service.getHealth()).toEqual({
      status: 'ok',
      version: '1.4.0',
      commit: 'a3f9c21',
    });
  });

  it('treats an empty variable as a real value, not a missing one', () => {
    // ?? only falls back on null/undefined. An empty string is what a pipeline
    // produces when a step forgets to set the variable, and seeing "" in the
    // response is the signal that the stamp step is broken.
    process.env.GIT_SHA = '';

    expect(service.getHealth().commit).toBe('');
  });

  it('reads the environment on every call, not once at construction', () => {
    expect(service.getHealth().commit).toBe('local');

    process.env.GIT_SHA = 'b7e1d04';

    expect(service.getHealth().commit).toBe('b7e1d04');
  });

  // The greeting is prose, so these pin its shape and say nothing about its
  // wording. Rewriting the sentence must not turn the pipeline red; deleting
  // the field or handing back something that is not a string must.
  describe('getGreeting', () => {
    it('returns an object carrying a message', () => {
      expect(service.getGreeting()).toHaveProperty('message');
    });

    it('the message is a non-empty string', () => {
      const { message } = service.getGreeting();

      expect(typeof message).toBe('string');
      expect(message.length).toBeGreaterThan(0);
    });

    it('carries nothing but the message', () => {
      // Guards against someone quietly attaching a user id, a token or an
      // internal path to a response that is public and unauthenticated.
      expect(Object.keys(service.getGreeting())).toEqual(['message']);
    });
  });
});
