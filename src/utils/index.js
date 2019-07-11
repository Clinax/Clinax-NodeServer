function createMsg(message, err) {
    let msg = message || (err && err.message) || "Some error occurred. Try again in some time";
    return msg
}

export const INVALID_REQUEST = (res) => create400(res, "Invalid Request");

export const create400 = (res, message, err) => createHTTPResponse(400, res, message, err);

export const create404 = (res, message, err) => createHTTPResponse(404, res, message, err);

export const create500 = (res, message, err) => createHTTPResponse(500, res, message, err);

export function createHTTPResponse(status, res, message, err) {
    var body = {
        message: createMsg(message, err),
    }

    if (detectDebug() && err)
        console.error(body.error = err);

    return res.status(status).send(body);
}

export const detectDebug = () => process.env.NODE_ENV !== 'production';

/**
 * return the length of a number
 * @param {Number} n any number
 * @returns The length of the given number 
 */
export const nLength = (n) => 1 + Math.log10(Math.abs(n) + 1) | 0;

export default {
    INVALID_REQUEST: INVALID_REQUEST,
    create400: create400,
    create404: create404,
    create500: create500,
    createHTTPResponse: createHTTPResponse
};