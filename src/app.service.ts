import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { createVacancy } from './helpers/create-vacancy';
import { TransferDto } from './job-opening-dto/transfer.dto';
import { Op } from '@graphprotocol/grc-20';
import { LocalDbHandler } from './helpers/local-db-handler';
import { validateVacancies } from './helpers/validate-vacancy';
import { createImage } from './helpers/lib/grapf/create-image';
import { UploadImageDto } from './job-opening-dto/upload-image-dto';
import { publish } from './helpers/publish-mainnet';
import { SuccessfullyCreatedJobsDb } from './models/local-db.interface';
import { IJobOpening } from './models/job-opening.interface';

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

  async transfer({ data }: TransferDto): Promise<Record<string, string>> {
    try {
      validateVacancies(data);

      const bulkOpsToPublish: Op[] = [];
      const createdJobOpeningsMap: Record<string, string> = {};
      const createdJobOpenings: SuccessfullyCreatedJobsDb = {};

      const loggers = this.#getLoggers();
      let localDBs = await this.#getLocalDBs(loggers);

      for (const jobOpening of data) {
        const { id, ops, projectId, updatedLocalDBs } = await createVacancy(
          jobOpening,
          localDBs,
        );

        bulkOpsToPublish.push(...ops);
        createdJobOpeningsMap[
          jobOpening.id ??
            `unknown job opening id created at ${new Date().toISOString()} on position ${data.indexOf(jobOpening)}`
        ] = id;

        createdJobOpenings[id] = this.#getSuccessfullyCreatedJobOpeningLog(
          jobOpening,
          projectId,
          id,
        );

        localDBs = updatedLocalDBs;
      }

      await this.#publish(bulkOpsToPublish);

      await Promise.all([
        this.#appendLocalDBs(loggers, localDBs),
        this.#successfullyCreatedJobOpeningHandler.append(createdJobOpenings),
      ]);

      return createdJobOpeningsMap;
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

  async uploadImage({
    name,
    description,
    url,
  }: UploadImageDto): Promise<string> {
    const imgLogger = new LocalDbHandler('images.json');
    const uploadImageResults = await createImage({
      name,
      description,
      url,
    });

    await this.#publish(uploadImageResults.ops);
    await imgLogger.append({
      [uploadImageResults.id]: {
        name,
        description,
        url,
      },
    });

    return uploadImageResults.id;
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
    jobOpening: IJobOpening,
    projectId: string,
    id: string,
  ) {
    return {
      timestamp: new Date().toISOString(),
      name: jobOpening.name.value,
      description: jobOpening.description.value,
      projectName: jobOpening.project.value.name.value,
      rawParsedDBJobOpeningId: jobOpening.id ?? `unknown`,
      projectId,
      id,
    };
  }

  #publish(ops: Op[]) {
    const tx = publish({
      spaceId: '9LDiEvyWSUxwVKU41b1Mbp',
      author: '0x3cdB5102F5a5D0C0FD47882430860ae96AFb6FAF',
      editName: 'Add 5 Job Openings',
      ops,
    });

    console.log('tx', tx);
    return tx;
  }
}
