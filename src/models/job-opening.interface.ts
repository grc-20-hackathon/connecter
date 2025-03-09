import { IType } from './type.interface';
import { IProject } from './project.interface';
import { IEntity } from './entity.interface';
import { ILocation } from './location.interface';
import { ISalary } from './selary.interface';

export interface IJobOpening {
  id: string;
  geoId: string | null;
  name: IType;
  description: IType;
  content: IType<string[]>;
  types: IType<IType<IEntity>[]>;
  avatar: IType<IType>;
  cover: IType<IType>;
  skills: IType<IType<IEntity>[]>;
  roles: IType<IType<IEntity>[]>;
  employmentTypes: IType<IType<IEntity>[]>;
  project: IType<IProject>;
  salaryMin: ISalary;
  salaryMax: ISalary;
  publishDate: IType;
  location: IType<ILocation>;
  relatedSpaces: IType<IType<IEntity>[]>;
  webURL: IType;
}
