import { normalizeSearchTerm } from './mormalize-search-term';
import { getTypeId } from './get-type-by-id';
import { fuzzySearch } from './fuzzy-search';

export async function searchEntity(
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
