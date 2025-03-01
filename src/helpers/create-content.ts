import { Op, Position, TextBlock } from '@graphprotocol/grc-20';

export const createContent = (entityId: string, content: string[]) => {
  const ops: Op[] = [];
  for (let i = 0; i < content.length; i++) {
    const position = Position.createBetween();
    const blockOps = TextBlock.make({
      fromId: entityId,
      text: content[i],
      position,
    });
    ops.push(...blockOps);
  }
  return ops;
};
