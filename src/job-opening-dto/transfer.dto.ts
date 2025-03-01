import { JobOpening } from '../models/job-opening.interface';
import { IsArray } from 'class-validator';

interface ITransferDto {
  data: JobOpening[];
}

export class TransferDto implements ITransferDto {
  @IsArray()
  data: JobOpening[];
}
