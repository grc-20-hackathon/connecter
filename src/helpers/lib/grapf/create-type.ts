import { createDefaultProperties } from './helpers/create-default-properties.js';
import {
  type CreateRelationOp,
  type DefaultProperties,
  type Op,
  Relation,
} from '@graphprotocol/grc-20';
import { generate } from '../core/id';
import { PROPERTY, SCHEMA_TYPE, TYPES_PROPERTY } from '../ids/system';
type Params = DefaultProperties & {
  properties?: Array<string>;
};

/**
 * Creates a type with the given name, description, cover, and properties.
 */
export const createType = ({
  name,
  description,
  cover,
  properties,
}: Params) => {
  const id = generate();
  const ops: Op[] = [];

  ops.push(
    ...createDefaultProperties({ entityId: id, name, description, cover }),
  );

  // set property "Types" to "Type"
  const relationOp = Relation.make({
    fromId: id,
    relationTypeId: TYPES_PROPERTY,
    toId: SCHEMA_TYPE,
  });
  ops.push(relationOp);

  if (properties) {
    for (const propertyId of properties) {
      const relationOp: CreateRelationOp = Relation.make({
        fromId: id,
        relationTypeId: PROPERTY,
        toId: propertyId,
      });
      ops.push(relationOp);
    }
  }

  return { id, ops };
};
