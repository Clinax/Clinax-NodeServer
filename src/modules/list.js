/**
 * Gives a comparator function which is to be given to Array.sort() function
 *
 * @param {String} field Sort list using the value of this field
 * @param {Boolean} reverse Whether to revese the sorted list
 * @param {(x) => Any} primer Function to access nested field
 * @returns {(a, b) => Number} comparator function to given to Array.sort() function
 */
export function sortBy(field, reverse, primer) {
  var key = primer ? (x) => primer(x[field]) : (x) => x[field];

  reverse = !reverse ? 1 : -1;

  return (a, b) => ((a = key(a)), (b = key(b)), reverse * ((a > b) - (b > a)));
}

export const getDistinct = (arr) => [...new Set(arr)];
