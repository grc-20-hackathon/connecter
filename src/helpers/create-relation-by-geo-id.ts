import { Op, Relation } from '@graphprotocol/grc-20';

export const createRelationByGeoId = (
  geoId: string | null | undefined,
  fromId: string,
  relationTypeId: string,
): Op[] => {
  if (!geoId) return [];

  return [
    Relation.make({
      fromId,
      relationTypeId,
      toId: geoId,
    }),
  ];
};
