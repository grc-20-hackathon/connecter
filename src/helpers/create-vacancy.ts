import { Id, Op, Relation, Triple } from '@graphprotocol/grc-20';
import { createEntity } from './lib/grapf/create-entity';
import {
  AVATAR_PROPERTY,
  LOCATION_PROPERTY,
  PROJECT_PROPERTY,
  PUBLISH_DATE_PROPERTY,
  ROLES_PROPERTY,
  SKILL_TYPE,
  SKILLS_PROPERTY,
  WEB_URL_PROPERTY,
} from './lib/ids/content';
import {
  COMPANY_TYPE,
  COVER_PROPERTY,
  NAME_PROPERTY,
  ROLE_PROPERTY,
} from './lib/ids/system';
import { createContent } from './create-content';
import { LocalDBs } from '../app.service';
import { normalizeSearchTerm } from './mormalize-search-term';
import { getSearchResults } from './get-search-results';
import { createRelationByGeoId } from './create-relation-by-geo-id';
import { getCurrencyUnitId } from './get-currency-unit-id';
import { createImage } from './lib/grapf/create-image';
import { IJobOpening } from '../models/job-opening.interface';

const JOB_OPENING_TYPE_ID = 'RaMe9z4ZwLnHvMJeQL7ZNk';
const EMPLOYMENT_TYPE_ID = 'XFpLwwaKZwonymUVVSKJfX';
const EMPLOYMENT_RELATION_ID = 'BLCNN8nrcU6T6NLu2QDQtw';
const SALARY_MIN_PROP_ID = 'DQA5H2ffqiLGbSnSx27TtN';
const SALARY_MAX_PROP_ID = 'Fw48wUrm7oD9z4JbT2K4G2';
const X_PROPERTY_ID = '2eroVfdaXQEUw314r5hr35';
const CRYPTO_SPACE_ID = '5N7kvjd6dQsfKGv6eSGkWi';
const RELATED_SPACE_ID = 'CHwmK8bk4KMCqBNiV2waL9';

const getDefaultEntity = () => ({
  id: '',
  ops: [] as Op[],
});

export const createVacancy = async (
  jobData: IJobOpening,
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

  const searchResults = await getSearchResults(jobData, updatedLocalDBs);

  const ops: Op[] = [];

  //Job entity
  const { id, ops: jobOps } = createEntity({
    name: jobData.name.geoId ? '' : jobData.name.value,
    description: jobData.description.value,
    types: [JOB_OPENING_TYPE_ID],
    cover: jobData?.cover?.value?.geoId as Id.Id,
  });
  ops.push(
    ...jobOps,
    ...createRelationByGeoId(jobData.name.geoId, id, NAME_PROPERTY),
  );

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
      types: [COMPANY_TYPE, PROJECT_PROPERTY],
    });

    const [createCoverResult, createAvatarResult] = await Promise.all([
      createImage({
        name: 'Cover for' + jobData.project?.value?.name?.value,
        description: 'Cover for' + jobData.project?.value?.name?.value,
        url: jobData.project.value.cover?.value?.value ?? '',
      }),
      createImage({
        name: 'Avatar for' + jobData.project?.value?.name?.value,
        description: 'Avatar for' + jobData.project?.value?.name?.value,
        url: jobData.project.value.avatar?.value?.value ?? '',
      }),
    ]);

    //add project cover
    ops.push(
      ...createCoverResult.ops,
      Relation.make({
        fromId: projectEntity.id,
        relationTypeId: COVER_PROPERTY,
        toId: createCoverResult.id as Id.Id,
      }),
    );

    //add project avatar
    ops.push(
      ...createAvatarResult.ops,
      Relation.make({
        fromId: projectEntity.id,
        relationTypeId: AVATAR_PROPERTY,
        toId: createAvatarResult.id as Id.Id,
      }),
      //add job avatar
      ...createRelationByGeoId(
        jobData.avatar?.value?.geoId ?? createAvatarResult.id,
        id,
        AVATAR_PROPERTY,
      ),
    );

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
  }

  ops.push(
    Relation.make({
      fromId: id,
      relationTypeId: PROJECT_PROPERTY,
      toId: projectEntity.id,
    }),
  );

  updatedLocalDBs.projects[projectName] = projectEntity.id;
  ops.push(
    ...projectEntity.ops,
    // ...createRelationByGeoId(
    //   jobData.project.value?.avatar?.value?.geoId,
    //   id,
    //   AVATAR_PROPERTY,
    // ),
  );

  // Add Salary
  if (jobData.salaryMin?.value) {
    ops.push(
      Triple.make({
        attributeId: SALARY_MIN_PROP_ID,
        entityId: id,
        value: {
          type: 'NUMBER',
          value: jobData.salaryMin.value.toString(),
          options: {
            unit:
              jobData.salaryMin.currency?.geoId ??
              getCurrencyUnitId(jobData.salaryMin.currency?.value),
          },
        },
      }),
    );
  }

  if (jobData.salaryMax?.value) {
    ops.push(
      Triple.make({
        attributeId: SALARY_MAX_PROP_ID,
        entityId: id,
        value: {
          type: 'NUMBER',
          value: jobData.salaryMax.value.toString(),
          options: {
            unit:
              jobData.salaryMax.currency?.geoId ||
              getCurrencyUnitId(jobData.salaryMax.currency?.value),
          },
        },
      }),
    );
  }

  //Add publish date
  if (jobData.publishDate?.value) {
    ops.push(
      Triple.make({
        attributeId: PUBLISH_DATE_PROPERTY,
        entityId: id,
        value: { type: 'TIME', value: jobData.publishDate.value },
      }),
    );
  }

  //Add location
  const regionName = normalizeSearchTerm(
    jobData.location?.value?.region?.value?.name?.value,
  );
  if (searchResults.location.region) {
    ops.push(
      Relation.make({
        fromId: id,
        relationTypeId: LOCATION_PROPERTY,
        toId: searchResults.location.region,
      }),
    );
    updatedLocalDBs.locations[regionName] = searchResults.location.region;
  } else if (jobData.location?.value?.region?.value?.name?.value) {
    if (!updatedLocalDBs.notFoundLocations[regionName]) {
      updatedLocalDBs.notFoundLocations[regionName] = 'region';
    }
  }

  const cityName = normalizeSearchTerm(
    jobData.location?.value?.city?.value?.name?.value,
  );
  if (searchResults.location.city) {
    ops.push(
      Relation.make({
        fromId: id,
        relationTypeId: LOCATION_PROPERTY,
        toId: searchResults.location.city,
      }),
    );
    updatedLocalDBs.locations[cityName] = searchResults.location.city;
  } else if (jobData.location?.value?.city?.value?.name?.value) {
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
  if (jobData.webURL?.value) {
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
