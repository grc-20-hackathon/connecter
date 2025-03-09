export interface IType<T = string> {
  property: string;
  value: T;
  geoId?: string;
}
