function normalizePath(id) {
    return id.replace(/\\/g, '/')
}

const knownJsSrcRE = /\.(js|vue)/ // vue文件也当js文件处理，因为vue文件会被转换成js文件
const isJSRequest = (url) => {
    return knownJsSrcRE.test(url)
}

exports.normalizePath = normalizePath
exports.isJSRequest = isJSRequest