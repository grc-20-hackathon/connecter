import { IType } from './type.interface';
import { IEntity } from './entity.interface';

export interface IProject {
  name: IType;
  description: IType;
  types: IType<IType<IEntity>[]>;
  avatar: IType<IType>;
  cover: IType<IType>;
  website: IType;
  x: IType;
}
