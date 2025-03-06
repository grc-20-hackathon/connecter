import { IResult } from './result.interface';

export interface IType<T = string> {
  property: string;
  value: T;
  geoId?: string | null;
  options?: IResult[];
}
