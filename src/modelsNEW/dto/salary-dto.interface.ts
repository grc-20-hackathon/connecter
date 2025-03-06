import { ITypeDto } from './type-dto.interface';

export interface ISalaryDto extends ITypeDto<number> {
  currency: string;
}
