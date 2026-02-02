
const static = require('serve-static');
function serveStaticMiddleware({ root }) {
  return static(root);
}
module.exports = serveStaticMiddleware;