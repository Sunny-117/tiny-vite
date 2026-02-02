const static = require('serve-static')

function serverStaticMiddleware(config) {
    return static(config.root)
}

module.exports = serverStaticMiddleware