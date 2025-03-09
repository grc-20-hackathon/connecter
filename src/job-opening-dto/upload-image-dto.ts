import { IsString } from 'class-validator';

interface IUploadImageDto {
  url: string;
  name: string;
  description: string;
}

export class UploadImageDto implements IUploadImageDto {
  @IsString()
  url: string;
  @IsString()
  name: string;
  @IsString()
  description: string;
}
