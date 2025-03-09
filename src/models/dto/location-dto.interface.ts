import { ITypeDto } from './type-dto.interface';
import { IEntityDto } from './entity-dto.interface';

export interface ILocationDto {
  city: ITypeDto<IEntityDto>;
  region: ITypeDto<IEntityDto>;
}
