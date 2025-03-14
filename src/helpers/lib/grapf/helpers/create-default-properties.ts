import {
  type DefaultProperties,
  Relation,
  Triple,
} from '@graphprotocol/grc-20';
import {
  COVER_PROPERTY,
  DESCRIPTION_PROPERTY,
  NAME_PROPERTY,
} from '../../ids/system';
import { Op } from '../../types';

export const createDefaultProperties = (
  params: DefaultProperties & { entityId: string },
) => {
  const { entityId, name, description, cover } = params;
  const ops: Op[] = [];

  if (name) {
    // set property "Name" to the provided name
    const nameTripleOp = Triple.make({
      entityId,
      attributeId: NAME_PROPERTY,
      value: {
        type: 'TEXT',
        value: name,
      },
    });
    ops.push(nameTripleOp);
  }

  if (description) {
    // set property "Description" to the provided description
    const descriptionTripleOp = Triple.make({
      entityId,
      attributeId: DESCRIPTION_PROPERTY,
      value: {
        type: 'TEXT',
        value: description,
      },
    });
    ops.push(descriptionTripleOp);
  }

  if (cover) {
    // add ID of cover "Image" to property "Cover"
    const relationOp = Relation.make({
      fromId: entityId,
      relationTypeId: COVER_PROPERTY,
      toId: cover,
    });
    ops.push(relationOp);
  }

  return ops;
};
