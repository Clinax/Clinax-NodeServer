import { isObject } from "util";

export const clone = (obj) => JSON.parse(JSON.stringify(obj));

export const isEmpty = (obj) =>
  Object.keys(obj).length === 0 && obj.constructor === Object;

export const clean = (obj) => {
  if (!isObject(obj)) return obj;

  for (const key in obj) if (obj[key] === "") delete obj[key];
  return obj;
};

export function extend(obj, src) {
  for (var key in src) obj[key] = src[key];
  return obj;
}

/**
 * Check if object 1 is equal to object 2
 * @param {Any} a Object 1
 * @param {Any} b Object 2
 */
export const isEqual = (a, b) => JSON.stringify(a) == JSON.stringify(b);

/**
 * Use this function to run a function in the object
 * @param {Object} object
 * @param {String} name
 * @param {...Any} parameters
 */
export function run(object, name, ...parameters) {
  let temp = object[name];
  parameters = parameters || [];

  if (temp && typeof temp === "function") {
    temp(...parameters);
  }
}
