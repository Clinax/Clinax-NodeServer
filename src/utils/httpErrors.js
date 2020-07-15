import { isString } from "util";
/**
 * Bad Request
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create400 = (res, ...options) =>
  createHTTPResponse(400, res, ...options);

/**
 * Unauthorized
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create401 = (res, ...options) =>
  createHTTPResponse(401, res, ...options);

/**
 * Forbidden
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create403 = (res, ...options) =>
  createHTTPResponse(403, res, ...options);

/**
 * Not Found
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create404 = (res, ...options) =>
  createHTTPResponse(404, res, ...options);

/**
 * Confict
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create409 = (res, ...options) =>
  createHTTPResponse(409, res, ...options);

/**
 * Invalid Token
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create498 = (res, ...options) =>
  createHTTPResponse(498, res, ...options);

/**
 * Token Required
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create499 = (res, ...options) =>
  createHTTPResponse(499, res, ...options);

/**
 * Internal Server Error
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export const create500 = (res, ...options) =>
  createHTTPResponse(500, res, ...options);

/**
 *
 * @param {Number} status http status code
 * @param {Request} res
 * @param  {[String|Error, Error]} options
 */
export function createHTTPResponse(status, res, ...options) {
  return res.status(status).json(getMessageBody(...options));
}

/**
 *
 * @param  {[String|Error, Error]} options
 * @return {String} Error string either from error or message provided
 */
function getMessageBody(...options) {
  var message, err;

  if (isString(options[0])) {
    message = options[0];
    err = options[1];
  } else err = options[0];

  message = message || (err && (err._message || err.message));

  const body = {
    message: message || "Some error occurred. Try again in some time",
  };

  if (err) console.warn((body.error = err));

  return body;
}
