import { generate } from '../core/id.js';
import {
  type DefaultProperties,
  type Op,
  type PropertiesParam,
  Relation,
} from '@graphprotocol/grc-20';
import { createDefaultProperties } from './helpers/create-default-properties';
import { TYPES_PROPERTY } from '../ids/system';
import { createProperties } from './helpers/create-properties';
export type Params = DefaultProperties & {
  properties?: PropertiesParam;
  types?: Array<string>;
};

/**
 * Creates an entity with the given name, description, cover, properties, and types.
 */
export const createEntity = ({
  name,
  description,
  cover,
  properties,
  types,
}: Params) => {
  const id = generate();
  const ops: Array<Op> = [];

  ops.push(
    ...createDefaultProperties({ entityId: id, name, description, cover }),
  );

  // add property "Types" to the provided types
  if (types) {
    for (const typeId of types) {
      const typeRelationOp = Relation.make({
        fromId: id,
        relationTypeId: TYPES_PROPERTY,
        toId: typeId,
      });
      ops.push(typeRelationOp);
    }
  }

  if (properties) {
    ops.push(...createProperties({ entityId: id, properties }));
  }

  return { id, ops };
};
