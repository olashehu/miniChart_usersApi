import { Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/v1/login')
  logn(@Req() data: any): any {
    return this.appService.login(data.body);
  }

  @Post('/v1/users')
  createUser(@Req() data: any): any {
    return this.appService.createUser(data.body);
  }
}
