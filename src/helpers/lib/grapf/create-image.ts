import { createDefaultProperties } from './helpers/create-default-properties.js';
import { uploadImage } from '../core/ipfs';
import { Image } from '../image.js';
import { CreateResult, Op } from '../types';
type CreateImageParams =
  | {
      blob: Blob;
      name?: string;
      description?: string;
    }
  | {
      url: string;
      name?: string;
      description?: string;
    };

/**
 * Creates an entity with the given name, description, cover, properties, and types.
 * All IDs passed to this function (cover, types, property IDs, relation IDs, etc.) are validated.
 * If any invalid ID is provided, the function will throw an error.
 *
 * @example
 * ```ts
 * const { id, ops } = createImage({
 *   url: 'https://example.com/image.png',
 *   name: 'name of the image', // optional
 *   description: 'description of the image', // optional
 * });
 *
 * const { id, ops } = createImage({
 *   blob: new Blob(…),
 *   name: 'name of the image', // optional
 *   description: 'description of the image', // optional
 * });
 * ```
 * @param params – {@link CreateImageParams}
 * @returns – {@link CreateResult}
 * @throws Will throw an IpfsUploadError if the image cannot be uploaded to IPFS
 */
export const createImage = async ({
  name,
  description,
  ...params
}: CreateImageParams): Promise<CreateResult> => {
  const ops: Array<Op> = [];
  const { cid, dimensions } = await uploadImage(params);
  const { id, ops: imageOps } = Image.make({ cid, dimensions });
  ops.push(...imageOps);
  ops.push(...createDefaultProperties({ entityId: id, name, description }));

  return {
    id,
    ops,
  };
};
