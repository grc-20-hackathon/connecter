export interface ISearchResult {
  results: IResult[];
}

export interface IResult {
  id: string;
  name: string;
  types: Omit<IResult, 'types'>[];
}
