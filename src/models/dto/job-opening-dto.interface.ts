import { ITypeDto } from './type-dto.interface';
import { IEntityDto } from './entity-dto.interface';
import { IProjectDto } from './project-dto.interface';
import { ILocationDto } from './location-dto.interface';
import { ISalaryDto } from './salary-dto.interface';

export interface IJobOpeningDto {
  id: string;
  name: ITypeDto;
  description: ITypeDto;
  content: ITypeDto<string[]>;
  types: ITypeDto<ITypeDto<IEntityDto>[]>;
  avatar: ITypeDto;
  cover: ITypeDto;
  skills: ITypeDto<ITypeDto<IEntityDto>[]>;
  roles: ITypeDto<ITypeDto<IEntityDto>[]>;
  employmentTypes: ITypeDto<ITypeDto<IEntityDto>[]>;
  project: ITypeDto<IProjectDto>;
  salaryMin: ISalaryDto;
  salaryMax: ISalaryDto;
  publishDate: ITypeDto;
  location: ITypeDto<ILocationDto>;
  relatedSpaces: ITypeDto<ITypeDto<IEntityDto>[]>;
  webURL: ITypeDto;
  geoId?: string;
}
