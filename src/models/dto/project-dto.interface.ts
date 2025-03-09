import { ITypeDto } from './type-dto.interface';
import { IEntityDto } from './entity-dto.interface';

export interface IProjectDto {
  name: ITypeDto;
  description: ITypeDto;
  types: ITypeDto<ITypeDto<IEntityDto>[]>;
  avatar: ITypeDto;
  cover: ITypeDto;
  website: ITypeDto;
  x: ITypeDto;
}
