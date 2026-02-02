const resolve = require('resolve')

// 获取此模块在硬盘上的绝对路径
const res = resolve.sync('check-is-array', { basedir: __dirname })
console.log(res);