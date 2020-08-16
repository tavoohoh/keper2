export type WhereFilterOp = '<' | '<=' | '==' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any';

export interface QuerySetModel {
  fieldPath: string;
  opStr: WhereFilterOp;
  value: string;
}
