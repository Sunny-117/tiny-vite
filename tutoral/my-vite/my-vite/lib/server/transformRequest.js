const fs = require('fs-extra')

/**
 * 针对所有的js文件的请求核心处理逻辑
 * @param {*} url 
 * @param {*} server 
 */
async function transformRequest(url, server) {
    const { pluginContainer } = server
    const { id } = await pluginContainer.resolveId(url) // 使用插件的resolveId方法获取url的绝对路径
    const loadResult = await pluginContainer.load(id) // 使用插件的load方法读取文件的内容
    let code;
    if (loadResult) {
        code = loadResult.code
    } else {
        code = await fs.readFile(id, 'utf-8') // 如果所有插件的load钩子都没有返回内容，走默认的逻辑就是读硬盘上的内容
    }
    const transformRequest = await pluginContainer.transform(code, id)
    return transformRequest
}

module.exports = transformRequest