/**
 *
 * @param {Object} object
 * @param {String} key
 * @param {Any} value
 * @param {{ parent? : Boolean, first? : Boolean }} options
 * @return {?Any} the parent which have the the given key-value pair
 */
export function findNestedItem(
  object,
  key,
  value,
  { parent = false, first = true }
) {
  if (!object) return null;

  var result = null;

  if (object instanceof Array) {
    for (var i = 0; i < object.length; i++) {
      result = findNestedKey(object[i], key, value, { parent, first });

      if (result) {
        if (parent) return object[prop];
        if (first) return result;
      }
    }
  } else {
    for (var prop in object) {
      if (prop == key) {
        if (object[prop] == value) {
          return object;
        }
      }

      if (object[prop] instanceof Object || object[prop] instanceof Array)
        result = findNestedKey(object[prop], key, value, { parent, first });
      if (result) {
        if (parent) return object[prop];
        if (first) return result;
      }
    }
  }
  return result;
}

/**
 *
 * @param { Object } object
 * @param { String } key
 * @return { Object } the parent object how contins the key
 */
export function findNestedKey(object, key) {
  var result = null;

  for (var prop in object) {
    if (prop == key) return object;

    if (object[prop] instanceof Object || object[prop] instanceof Array)
      result = findNestedKey(object[prop], key);
    if (result) break;
  }

  return result;
}
