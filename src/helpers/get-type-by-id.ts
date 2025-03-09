import { Result } from './fuzzy-search';

export const getTypeId = (
  searchResults: Result[],
  name: string,
  type: string,
) =>
  searchResults
    ?.filter((result) => result.types.some(({ name }) => name === type))
    .find((result) => result.name.trim().toLowerCase() === name.toLowerCase())
    ?.id;
