// const vue = require('@vitejs/plugin-vue')
const vue = require('./plugins/plugin-vue') // 使用自己写的vite支持vue的插件

module.exports =  {
    plugins: [
        vue()
    ]
}