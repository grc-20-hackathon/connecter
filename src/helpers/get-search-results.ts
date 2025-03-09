import { searchEntity } from './search-entity';
import { LocalDBs } from '../app.service';
import { IJobOpening } from '../models/job-opening.interface';

export const getSearchResults = async (
  jobData: IJobOpening,
  updatedLocalDBs: LocalDBs,
) => {
  const searchPromises = {
    roles: jobData.roles.value.map(
      (role) =>
        role.value.name.geoId ||
        searchEntity(role.value.name.value, 'Role', updatedLocalDBs.roles),
    ),
    skills: jobData.skills.value.map(
      (skill) =>
        skill.value.name.geoId ||
        searchEntity(skill.value.name.value, 'Skill', updatedLocalDBs.skills),
    ),
    employmentTypes: jobData.employmentTypes.value.map(
      (empType) =>
        empType.value.name.geoId ||
        searchEntity(
          empType.value.name.value,
          'Employment type',
          updatedLocalDBs.employmentTypes,
        ),
    ),
    project:
      jobData.project.value.name.geoId ||
      searchEntity(
        jobData.project.value.name.value,
        'Project',
        updatedLocalDBs.projects,
      ),
    location: {
      region:
        jobData.location?.value?.region?.value?.name?.geoId ||
        searchEntity(
          jobData.location?.value.region?.value?.name?.value,
          'Region',
          updatedLocalDBs.locations,
        ),
      city:
        jobData.location?.value?.city?.value?.name?.geoId ||
        searchEntity(
          jobData.location?.value?.city?.value?.name?.value,
          'City',
          updatedLocalDBs.locations,
        ),
    },
  };
  return {
    roles: await Promise.all(searchPromises.roles),
    skills: await Promise.all(searchPromises.skills),
    employmentTypes: await Promise.all(searchPromises.employmentTypes),
    project: await searchPromises.project,
    location: {
      region: await searchPromises.location.region,
      city: await searchPromises.location.city,
    },
  };
};
