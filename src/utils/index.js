export const INVALID_REQUEST = (res) => {
    return create400(res, "Invalid Request");
}

export function create400(res, message, err) {
    return createHTTPResponse(400, res, message + (err ? `--> ${err.message}` : ''));
}

export function create404(res, message, err) {
    return createHTTPResponse(404, res, message + (err ? `--> ${err.message}` : ''));
}

export function create500(res, message, err) {
    let msg = message || "Some error occurred. Try again in some time";
    if (err) msg += `--> ${err.message}`

    return createHTTPResponse(500, res, msg);
}

export function createHTTPResponse(status, res, message) {
    return res.status(status).send({
        message: message
    });
}

export default {
    INVALID_REQUEST: INVALID_REQUEST,
    create400: create400,
    create404: create404,
    create500: create500,
    createHTTPResponse: createHTTPResponse
};