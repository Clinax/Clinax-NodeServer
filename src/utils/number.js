/**
 * return the length of a number
 * @param {Number} n any number
 * @returns The length of the given number
 */
export const getDigitCount = (n) => (1 + Math.log10(Math.abs(n) + 1)) | 0;
