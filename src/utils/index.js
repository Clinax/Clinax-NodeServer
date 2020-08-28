import { getDistinct } from "@pranavraut033/js-utils/utils/list";

export const isProduction = () => process.env.NODE_ENV === "production";

export function getDistinctProp(array, mapper) {
  return getDistinct(array.map(mapper).filter((ev) => !!ev));
}
