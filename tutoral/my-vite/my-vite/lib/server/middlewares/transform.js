const { parse } = require("url")
const { isJSRequest } = require('../../utils')
const send = require('../send')
const transformRequest = require('../transformRequest')
function transformMiddleware(server) {
    return async function (req, res, next) {
        if (req.method !== 'GET') {
            return next()
        }
        let url = parse(req.url).pathname
        if (isJSRequest(url)) {
            const result = await transformRequest(req.url, server)
            if (result) {
                // 把转换后得到的代码发送给客户端
                return send(req, res, result.code, 'js')
            } else {
                return next()
            }
        } else {
            return next()
        }
    }
}

module.exports = transformMiddleware