export const normalizeSearchTerm = (searchTerm: string) =>
  searchTerm
    ?.split(' ')
    .map((word) => word.trim())
    .filter(Boolean)
    .join(' ')
    .replaceAll(/[^a-zA-Z0-9]/g, '') ?? '';
