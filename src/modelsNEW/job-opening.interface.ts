import { IType } from './type.interface';
import { IProject } from './project.interface';
import { IEntity } from './entity.interface';
import { ILocation } from './location.interface';
import { ISalaryDto } from './dto/salary-dto.interface';

export interface IJobOpening {
  id: string;
  geoId: string | null;
  isLoading: boolean;
  name: IType;
  description: IType;
  content: IType<string[]>;
  types: IType<IType<IEntity>[]>;
  avatar: IType;
  cover: IType;
  skills: IType<IType<IEntity>[]>;
  roles: IType<IType<IEntity>[]>;
  employmentTypes: IType<IType<IEntity>[]>;
  project: IType<IProject>;
  salaryMin: ISalaryDto;
  salaryMax: ISalaryDto;
  publishDate: IType;
  location: IType<ILocation>;
  relatedSpaces: IType<IType<IEntity>[]>;
  webURL: IType;
}
