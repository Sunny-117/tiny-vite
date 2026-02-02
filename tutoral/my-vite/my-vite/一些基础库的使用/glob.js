const fastGlob = require('fast-glob');

// 遍历文件系统
(async function () {
    const entires = await fastGlob(["*/*.js"])
    console.log(entires);
})();