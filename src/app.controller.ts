import { Body, Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/bv-service/svalidate/wrapper')
  async validateBvn(@Body() body: { bvn?: string }): Promise<any> {
    return await this.appService.validateBvn(body);
  }
}
