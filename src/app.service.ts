import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { createVacancy } from './helpers/create-vacancy';
import { TransferDto } from './job-opening-dto/transfer.dto';
import { Op } from '@graphprotocol/grc-20';
import { LocalDbHandler } from './helpers/local-db-handler';
import { SuccessfullyCreatedJobsDb } from './models/local-db.interface';
import { validateVacancies } from './helpers/validate-vacancy';
import { JobOpening } from './models/job-opening.interface';

export interface LocalDBs {
  projects: Readonly<Record<string, string>>;
  roles: Readonly<Record<string, string>>;
  skills: Readonly<Record<string, string>>;
  employmentTypes: Readonly<Record<string, string>>;
  locations: Readonly<Record<string, string>>;
  notFoundLocations: Readonly<Record<string, string>>;
}

type LoggersKeys<T extends string> = `${T}Db`;

type Loggers<T> = {
  [Property in keyof T as LoggersKeys<Property & string>]: LocalDbHandler<
    Readonly<Record<string, string>>
  >;
};

@Injectable()
export class AppService {
  #successfullyCreatedJobOpeningHandler =
    new LocalDbHandler<SuccessfullyCreatedJobsDb>(
      'successfully-created-job-openings.json',
    );
  #errorsHandler = new LocalDbHandler('errors.json');

  async transfer({ data }: TransferDto): Promise<string[]> {
    try {
      validateVacancies(data);

      const bulkOpsToPublish: Op[] = [];
      const createdJobOpeningIds: string[] = [];
      const createdJobOpenings: SuccessfullyCreatedJobsDb = {};

      const loggers = this.#getLoggers();
      let localDBs = await this.#getLocalDBs(loggers);

      for (const jobOpening of data) {
        const { id, ops, projectId, updatedLocalDBs } = await createVacancy(
          jobOpening,
          localDBs,
        );

        bulkOpsToPublish.push(...ops);
        createdJobOpeningIds.push(id);

        createdJobOpenings[id] = this.#getSuccessfullyCreatedJobOpeningLog(
          jobOpening,
          projectId,
          id,
        );

        localDBs = updatedLocalDBs;
      }

      // const txHash = await publish({2
      //   spaceId: 'PHsbZCCxokzvMxVGphntsc',
      //   author: config.author,
      //   editName: 'Create Job Opening',
      //   ops: bulkOpsToPublish,
      // });

      await Promise.all([
        this.#appendLocalDBs(loggers, localDBs),
        this.#successfullyCreatedJobOpeningHandler.append(createdJobOpenings),
      ]);

      return createdJobOpeningIds;
    } catch (error) {
      console.error(error);

      this.#errorsHandler
        .append({
          [`[${new Date().toISOString()}]`]: `Error processing job openings: 
        ${data.map((jobOpening) => jobOpening.name?.value ?? jobOpening.description?.value).join(', ')}
      with error: ${JSON.stringify(error)}]`,
        })
        .catch(console.error);

      throw new UnprocessableEntityException(
        'Error creating job openings ' + (error as Error).message,
      );
    }
  }

  #getLoggers(): Loggers<LocalDBs> {
    return {
      locationsDb: new LocalDbHandler('locations.json'),
      notFoundLocationsDb: new LocalDbHandler('not-found-locations.json'),
      projectsDb: new LocalDbHandler('projects.json'),
      rolesDb: new LocalDbHandler('roles.json'),
      skillsDb: new LocalDbHandler('skills.json'),
      employmentTypesDb: new LocalDbHandler('employment-types.json'),
    };
  }

  async #getLocalDBs({
    projectsDb,
    employmentTypesDb,
    notFoundLocationsDb,
    locationsDb,
    rolesDb,
    skillsDb,
  }: Loggers<LocalDBs>): Promise<LocalDBs> {
    return {
      projects: await projectsDb.read(),
      employmentTypes: await employmentTypesDb.read(),
      notFoundLocations: await notFoundLocationsDb.read(),
      locations: await locationsDb.read(),
      roles: await rolesDb.read(),
      skills: await skillsDb.read(),
    };
  }

  async #appendLocalDBs(loggers: Loggers<LocalDBs>, localDBs: LocalDBs) {
    return Promise.all(
      Object.entries(localDBs).map(([key, value]) => {
        return loggers[`${key}Db` as keyof Loggers<LocalDBs>].append(value);
      }),
    );
  }

  #getSuccessfullyCreatedJobOpeningLog(
    jobOpening: JobOpening,
    id: string,
    projectId: string,
  ) {
    return {
      timestamp: new Date().toISOString(),
      name: jobOpening.name.value,
      description: jobOpening.description.value,
      projectName: jobOpening.project.value.name.value,
      projectId,
      id,
    };
  }
}
