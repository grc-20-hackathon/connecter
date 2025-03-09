import { IsArray } from 'class-validator';
import { IJobOpening } from 'src/models/job-opening.interface';

interface ITransferDto {
  data: IJobOpening[];
}

export class TransferDto implements ITransferDto {
  @IsArray()
  data: IJobOpening[];
}
