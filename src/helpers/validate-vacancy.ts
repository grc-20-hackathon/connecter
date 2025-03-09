import { IJobOpening } from 'src/models/job-opening.interface';


export const validateVacancies = (jobOpenings: IJobOpening[]): void | never => {
  jobOpenings.forEach((jobOpening) => {
    if (jobOpening.geoId) {
      throw new Error(
        `Job opening: ${jobOpening.name.value} with geoId: ${jobOpening.geoId} already exists`,
      );
    }

    if (!jobOpening?.name?.value) {
      throw new Error('Name is required');
    }

    if (!jobOpening.description?.value) {
      throw new Error('Description is required');
    }

    if (!jobOpening.content?.value?.length) {
      throw new Error('Content is required');
    }

    if (
      !jobOpening.roles?.value?.length ||
      !jobOpening.roles.value[0].value?.name
    ) {
      throw new Error('Roles are required');
    }

    if (!jobOpening.skills?.value?.length) {
      throw new Error('Skills are required');
    }

    if (
      !jobOpening.project?.value?.name?.value ||
      !jobOpening.project?.value?.description?.value
    ) {
      throw new Error('Project is required');
    }

    if (!jobOpening.webURL?.value) {
      throw new Error('Web URL is required');
    }
  });
};
