import {
    detectDebug
} from "../utils";

export default Object.seal({
    port: process.env.PORT || 3000, // Port to be used by app server
    validSessionTTL: detectDebug() ? 5 : 1, // In hours
})