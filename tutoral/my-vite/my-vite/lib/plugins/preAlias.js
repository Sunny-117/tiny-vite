
function preAliasPlugin() {
    let _server
    return {
        name: 'vite:pre-alias',
        configureServer(server) {
            _server = server
        },
        resolveId(id) {
            const metadata = _server._optimizeDepsMetadata
            const isOptimized = metadata.optimized[id]
            if (isOptimized) {
                return {
                    id: isOptimized.file
                }
            }
        }
    }
}

module.exports = preAliasPlugin