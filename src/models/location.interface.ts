import { IType } from './type.interface';
import { IEntity } from './entity.interface';

export interface ILocation {
  city: IType<IEntity>;
  region: IType<IEntity>;
}
