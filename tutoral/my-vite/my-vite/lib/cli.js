let { createServer } = require('./server');

(async function () {
    const server = await createServer()
    server.linsten(9999)
})()