export const containsAll = (arr1: any[], arr2: any[]): boolean =>
  arr2.every((arr2Item) => arr1.includes(arr2Item));

export const sameMembers = (arr1: any[], arr2: any[]): boolean =>
  containsAll(arr1, arr2) && containsAll(arr2, arr1);
