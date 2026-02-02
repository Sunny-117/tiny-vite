const connect = require('connect')
const { log } = require('console')
const http = require('http')
const middlewares = connect()

middlewares.use((req, res, next) => {
    log('middleware1')
    next()
})
middlewares.use((req, res, next) => {
    log('middleware2')
    next()
})
middlewares.use((req, res, next) => {
    res.end('hello')
})

http.createServer(middlewares).listen(3000, () => log('listen 3000'))

// 模拟connect
function connect_() {
    const middlewares = []
    const handler = (req, res) => {
        let index = 0;
        function next() {
            let i = index++
            if(i < middlewares.length) middlewares[i](req, res, next);
        }
        next()
    }
    handler.use = function (middleware) {
        middlewares.push(middleware)
    }
    return handler
}