const { init, parse } = require('es-module-lexer')
// 解析导入导出
let sourceCode = "import _ from 'lodash'; \n export var age = 12;";

(async () => {
    await init;
    const [imports, exports] = parse(sourceCode);
    console.log(imports);
    console.log(exports);
})();