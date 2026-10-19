import { Injectable } from '@nestjs/common';

export interface Health {
  status: 'ok';
  version: string;
  commit: string;
}

export interface Greeting {
  message: string;
}

// The one line this demo edits live. It is prose: a person reads it, nothing
// branches on it, so changing it cannot break a caller. Compare GREETING with
// Health.status below, which is a contract: machines read it and decide things
// from it, so it is pinned by a test and changing it is a breaking change.
const GREETING = 'This is news from ci cd';

@Injectable()
export class AppService {
  getHealth(): Health {
    return {
      status: 'ok',
      // Stamped onto the artifact at build time rather than read from
      // package.json, so what the endpoint reports is what the pipeline
      // actually built. There is no pipeline when running locally, hence the
      // fallbacks: anything other than dev/local came from CI.
      version: process.env.APP_VERSION ?? 'dev',
      commit: process.env.GIT_SHA ?? 'local',
    };
  }

  getGreeting(): Greeting {
    return { message: GREETING };
  }
}
