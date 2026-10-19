import { Controller, Get } from '@nestjs/common';
import { AppService, type Greeting, type Health } from './app.service.js';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  getHealth(): Health {
    return this.appService.getHealth();
  }

  @Get('hello')
  getHello(): Greeting {
    return this.appService.getGreeting();
  }
}
