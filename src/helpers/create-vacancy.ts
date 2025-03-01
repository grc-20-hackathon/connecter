import { JobOpening } from '../models/job-opening.interface';
import { Op, Relation, Triple } from '@graphprotocol/grc-20';
import { createEntity } from './lib/grapf/create-entity';
import {
  LOCATION_PROPERTY,
  PROJECT_PROPERTY,
  PUBLISH_DATE_PROPERTY,
  ROLES_PROPERTY,
  SKILL_TYPE,
  SKILLS_PROPERTY,
  WEB_URL_PROPERTY,
} from './lib/ids/content';
import { COMPANY_TYPE, ROLE_PROPERTY } from './lib/ids/system';
import { createContent } from './create-content';
import { fuzzySearch, Result } from './fuzzy-search';
import { LocalDBs } from '../app.service';

const JOB_OPENING_TYPE_ID = 'RaMe9z4ZwLnHvMJeQL7ZNk';
const EMPLOYMENT_TYPE_ID = 'XFpLwwaKZwonymUVVSKJfX';
const EMPLOYMENT_RELATION_ID = 'BLCNN8nrcU6T6NLu2QDQtw';
const SALARY_MIN_PROP_ID = 'DQA5H2ffqiLGbSnSx27TtN';
const SALARY_MAX_PROP_ID = 'Fw48wUrm7oD9z4JbT2K4G2';
const X_PROPERTY_ID = '2eroVfdaXQEUw314r5hr35';
const CRYPTO_SPACE_ID = '5N7kvjd6dQsfKGv6eSGkWi';
const RELATED_SPACE_ID = 'CHwmK8bk4KMCqBNiV2waL9';

const normalizeSearchTerm = (searchTerm: string) =>
  searchTerm
    .split(' ')
    .map((word) => word.trim())
    .filter(Boolean)
    .join(' ')
    .replaceAll(/[^a-zA-Z0-9]/g, '');

const getTypeId = (searchResults: Result[], name: string, type: string) =>
  searchResults
    ?.filter((result) => result.types.some(({ name }) => name === type))
    .find((result) => result.name.trim().toLowerCase() === name.toLowerCase())
    ?.id;

const getDefaultEntity = () => ({
  id: '',
  ops: [] as Op[],
});

async function searchEntity(
  name: string,
  type: string,
  localDb: Record<string, string>,
): Promise<string> {
  const normalizedName = normalizeSearchTerm(name);
  return (
    localDb[normalizedName] ||
    (getTypeId(await fuzzySearch(normalizedName), normalizedName, type) ?? '')
  );
}

export const createVacancy = async (
  jobData: JobOpening,
  localDBs: LocalDBs,
) => {
  const updatedLocalDBs = {
    projects: { ...localDBs.projects },
    roles: { ...localDBs.roles },
    skills: { ...localDBs.skills },
    employmentTypes: { ...localDBs.employmentTypes },
    locations: { ...localDBs.locations },
    notFoundLocations: { ...localDBs.notFoundLocations },
  };

  const searchPromises = {
    roles: jobData.roles.value.map((role) =>
      searchEntity(role.value.name.value, 'Role', updatedLocalDBs.roles),
    ),
    skills: jobData.skills.value.map((skill) =>
      searchEntity(skill.value.name.value, 'Skill', updatedLocalDBs.skills),
    ),
    employmentTypes: jobData.employmentTypes.value.map((empType) =>
      searchEntity(
        empType.value.name.value,
        'EmploymentType', //todo check type
        updatedLocalDBs.employmentTypes,
      ),
    ),
    project: searchEntity(
      jobData.project.value.name.value,
      'Project',
      updatedLocalDBs.projects,
    ),
    location: {
      region: jobData.location?.value?.region?.value?.name?.value
        ? searchEntity(
            jobData.location.value.region.value.name.value,
            'Region',
            updatedLocalDBs.locations,
          )
        : Promise.resolve(''),
      city: jobData.location?.value?.city?.value?.name?.value
        ? searchEntity(
            jobData.location.value.city.value.name.value,
            'City',
            updatedLocalDBs.locations,
          )
        : Promise.resolve(''),
    },
  };

  const searchResults = {
    roles: await Promise.all(searchPromises.roles),
    skills: await Promise.all(searchPromises.skills),
    employmentTypes: await Promise.all(searchPromises.employmentTypes),
    project: await searchPromises.project,
    location: {
      region: await searchPromises.location.region,
      city: await searchPromises.location.city,
    },
  };

  const ops: Op[] = [];

  //Job entity
  const { id, ops: jobOps } = createEntity({
    name: jobData.name.value,
    description: jobData.description.value,
    types: [JOB_OPENING_TYPE_ID],
    cover: jobData?.cover?.value ?? null,
  });
  ops.push(...jobOps);

  // Add Content
  ops.push(...createContent(id, jobData.content.value));

  // Add Roles
  jobData.roles.value.forEach((role, index) => {
    const roleName = normalizeSearchTerm(role.value.name.value);
    let roleEntity = getDefaultEntity();
    roleEntity.id = searchResults.roles[index];

    if (!roleEntity.id) {
      roleEntity = createEntity({
        name: role.value.name.value,
        description: role.value.description.value,
        types: [ROLE_PROPERTY],
      });
    }

    ops.push(
      ...roleEntity.ops,
      Relation.make({
        fromId: id,
        relationTypeId: ROLES_PROPERTY,
        toId: roleEntity.id,
      }),
    );
    updatedLocalDBs.roles[roleName] = roleEntity.id;
  });

  // Add Skills
  jobData.skills.value.forEach((skill, index) => {
    const skillName = normalizeSearchTerm(skill.value.name.value);
    let skillEntity = getDefaultEntity();
    skillEntity.id = searchResults.skills[index];

    if (!skillEntity.id) {
      skillEntity = createEntity({
        name: skill.value.name.value,
        description: skill.value.description.value,
        types: [SKILL_TYPE],
      });
    }

    ops.push(
      ...skillEntity.ops,
      Relation.make({
        fromId: id,
        relationTypeId: SKILLS_PROPERTY,
        toId: skillEntity.id,
      }),
    );
    updatedLocalDBs.skills[skillName] = skillEntity.id;
  });

  // Add Employment Types
  jobData.employmentTypes.value.forEach((employmentType, index) => {
    const employmentTypeName = normalizeSearchTerm(
      employmentType.value.name.value,
    );
    let employmentTypeEntity = getDefaultEntity();
    employmentTypeEntity.id = searchResults.employmentTypes[index];

    if (!employmentTypeEntity.id) {
      employmentTypeEntity = createEntity({
        name: employmentType.value.name.value,
        description: employmentType.value.description.value,
        types: [EMPLOYMENT_TYPE_ID],
      });
    }

    ops.push(
      ...employmentTypeEntity.ops,
      Relation.make({
        fromId: id,
        relationTypeId: EMPLOYMENT_RELATION_ID,
        toId: employmentTypeEntity.id,
      }),
    );
    updatedLocalDBs.employmentTypes[employmentTypeName] =
      employmentTypeEntity.id;
  });

  // Add Project
  const projectName = normalizeSearchTerm(jobData.project.value.name.value);
  let projectEntity = getDefaultEntity();
  projectEntity.id = searchResults.project;

  if (!projectEntity.id) {
    projectEntity = createEntity({
      name: jobData.project.value.name.value,
      description: jobData.project.value.description.value,
      cover: jobData.project.value?.cover?.value ?? null,
      types: [COMPANY_TYPE, PROJECT_PROPERTY],
    });

    if (jobData.project.value?.website?.value) {
      ops.push(
        Triple.make({
          attributeId: WEB_URL_PROPERTY,
          entityId: projectEntity.id,
          value: { type: 'URL', value: jobData.project.value.website.value },
        }),
      );
    }

    if (jobData.project.value?.x?.value) {
      ops.push(
        Triple.make({
          attributeId: X_PROPERTY_ID,
          entityId: projectEntity.id,
          value: { type: 'URL', value: jobData.project.value.x.value },
        }),
      );
    }

    ops.push(
      Relation.make({
        fromId: id,
        relationTypeId: PROJECT_PROPERTY,
        toId: projectEntity.id,
      }),
    );
  }
  updatedLocalDBs.projects[projectName] = projectEntity.id;
  ops.push(...projectEntity.ops);

  // Add Salary
  if (!jobData.salaryMin?.value) {
    ops.push(
      Triple.make({
        attributeId: SALARY_MIN_PROP_ID,
        entityId: id,
        value: {
          type: 'NUMBER',
          value: jobData.salaryMin.value,
          options: { unit: '2eGL8drmSYAqLoetcx3yR1' },
        },
      }),
    );
  }

  if (!jobData.salaryMax?.value) {
    ops.push(
      Triple.make({
        attributeId: SALARY_MAX_PROP_ID,
        entityId: id,
        value: {
          type: 'NUMBER',
          value: jobData.salaryMax.value,
          options: { unit: 'EWCAJP9TQoZ3EhcwyRg7mk' },
        },
      }),
    );
  }

  //Add publish date
  if (!jobData.publishDate?.value) {
    ops.push(
      Triple.make({
        attributeId: PUBLISH_DATE_PROPERTY,
        entityId: id,
        value: { type: 'TIME', value: jobData.publishDate.value },
      }),
    );
  }

  //Add location
  if (searchResults.location.region) {
    const regionName = normalizeSearchTerm(
      jobData.location?.value?.region?.value?.name?.value,
    );
    ops.push(
      Relation.make({
        fromId: id,
        relationTypeId: LOCATION_PROPERTY,
        toId: searchResults.location.region,
      }),
    );
    updatedLocalDBs.locations[regionName] = searchResults.location.region;
  } else if (jobData.location?.value?.region?.value?.name?.value) {
    const regionName = normalizeSearchTerm(
      jobData.location.value.region.value.name.value,
    );
    if (!updatedLocalDBs.notFoundLocations[regionName]) {
      updatedLocalDBs.notFoundLocations[regionName] = 'region';
    }
  }

  if (searchResults.location.city) {
    const cityName = normalizeSearchTerm(
      jobData.location?.value?.city?.value?.name?.value,
    );
    ops.push(
      Relation.make({
        fromId: id,
        relationTypeId: LOCATION_PROPERTY,
        toId: searchResults.location.city,
      }),
    );
    updatedLocalDBs.locations[cityName] = searchResults.location.city;
  } else if (jobData.location?.value?.city?.value?.name?.value) {
    const cityName = normalizeSearchTerm(
      jobData.location.value.city.value.name.value,
    );
    if (!updatedLocalDBs.notFoundLocations[cityName]) {
      updatedLocalDBs.notFoundLocations[cityName] = 'city';
    }
  }

  //Add related space
  ops.push(
    Relation.make({
      fromId: id,
      relationTypeId: RELATED_SPACE_ID,
      toId: CRYPTO_SPACE_ID,
    }),
  );

  //Add website
  if (!jobData.webURL?.value) {
    ops.push(
      Triple.make({
        attributeId: WEB_URL_PROPERTY,
        entityId: id,
        value: { type: 'URL', value: jobData.webURL.value },
      }),
    );
  }

  return { id, ops, projectId: projectEntity.id, updatedLocalDBs };
};
