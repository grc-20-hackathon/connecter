import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { TransferDto } from './job-opening-dto/transfer.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/transfer')
  transfer(@Body(new ValidationPipe()) transferDto: TransferDto) {
    return this.appService.transfer(transferDto);
  }
}
