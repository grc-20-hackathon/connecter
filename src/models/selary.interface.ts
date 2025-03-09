import { IType } from './type.interface';

export interface ISalary extends IType<number> {
  currency: IType<'USD' | 'EUR' | 'GBP'>;
}
