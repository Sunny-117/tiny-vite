const { isJSRequest } = require("../utils");
const send = require("../send");
const transformRequest = require("../transformRequest");
const { parse } = require("url");
function transformMiddleware(server) {
    return async function (req, res, next) {
        if (req.method !== "GET") {
            return next();
        }
        let url = parse(req.url).pathname;
        if (isJSRequest(url)) {
            //切记这个地方要把req.url传给transformRequest，不是url,否则会丢失query
            const result = await transformRequest(req.url, server);
            if (result) {
                const type = "js";
                return send(req, res, result.code, type);
            }
        } else {
            return next();
        }
    };
}
module.exports = transformMiddleware;