import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AppService } from './app.service';
import { TransferDto } from './job-opening-dto/transfer.dto';
import { UploadImageDto } from './job-opening-dto/upload-image-dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/transfer')
  transfer(@Body(new ValidationPipe()) transferDto: TransferDto) {
    return this.appService.transfer(transferDto);
  }

  @Post('/upload-image')
  uploadImage(
    @Body(new ValidationPipe()) uploadImageDto: UploadImageDto,
  ): Promise<string> {
    return this.appService.uploadImage(uploadImageDto);
  }
}
