const {
    parse,
    compileScript,
    rewriteDefault,
    compileTemplate,
    compileStyleAsync
} = require("vue/compiler-sfc");
const fs = require("fs");
const path = require('path');
const hash = require('hash-sum');

const descriptorCache = new Map();
function vue() {
    return {
        name: "vue",
        config(config) {
            root = config.root
            return {
                define: {
                    __VUE_OPTIONS_API__: true,
                    __VUE_PROD_DEVTOOLS__: false
                }
            }
        },
        async load(id) {
            const { filename, query } = parseVueRequest(id);
            if (query.has('vue')) {
                const descriptor = await getDescriptor(filename, root);
                if (query.get('type') === 'style') {
                    let block = descriptor.styles[Number(query.get('index'))];
                    if (block) {
                        return { code: block.content };
                    }
                }
            }
        },
        async transform(code, id) {
            const { filename, query } = parseVueRequest(id);
            // console.log('vue-hadler: ', { id, filename })
            if (filename.endsWith(".vue")) {
                if (query.get('type') === 'style') {
                    const descriptor = await getDescriptor(filename, root);
                    let result = await transformStyle(code, descriptor, query.get('index'));
                    return result;
                } else {
                    let result = await transformMain(code, filename, root);
                    return result;
                }
            }
            return null;
        },
    };
}

async function transformStyle(code, descriptor, index) {
    const block = descriptor.styles[index];
    //如果是CSS，其实翻译之后和翻译之前内容是一样的
    const result = await compileStyleAsync({
        filename: descriptor.filename,
        source: code,
        id: `data-v-${descriptor.id}`,//必须传递，不然报错
        scoped: block.scoped
    });
    let styleCode = result.code;
    const injectCode =
        `\nvar style = document.createElement('style');` +
        `\nstyle.innerHTML = ${JSON.stringify(styleCode)};` +
        `\ndocument.head.appendChild(style);`
    return {
        code: injectCode
    };
}

async function getDescriptor(filename, root) {
    let descriptor = descriptorCache.get(filename);
    if (descriptor) return descriptor;
    const content = await fs.promises.readFile(filename, 'utf8');
    const result = parse(content, { filename });
    descriptor = result.descriptor;
    descriptor.id = hash(path.relative(root, filename));
    descriptorCache.set(filename, descriptor);
    return descriptor;
}

async function transformMain(source, filename, root) {
    console.log('filename+root', { filename, root })
    const descriptor = await getDescriptor(filename, root);
    console.log('descriptor-->', descriptor)
    const scriptCode = genScriptCode(descriptor, filename);
    const templateCode = genTemplateCode(descriptor, filename);
    const stylesCode = genStyleCode(descriptor, filename)
    console.log('scriptCode和templateCode', { stylesCode, scriptCode, templateCode })
    let resolvedCode = [
        stylesCode,
        templateCode,
        scriptCode,
        `_sfc_main['render'] = render`,
        `export default _sfc_main`,
    ].join("\n");
    return { code: resolvedCode };
}

function genStyleCode(descriptor, filename) {
    console.log(filename, 'smksmkakmakmamk')
    let styleCode = '';
    if (descriptor.styles?.length) {
        descriptor.styles.forEach((style, i) => {
            const query = `?vue&type=style&index=${i}&lang=css`;
            // TODO：路径有问题
            // const styleRequest = (filename + query).replace(/\\/g, '/');
            const styleRequest = ('/src/App.vue' + query).replace(/\\/g, '/');
            console.log('styleRequeststyleRequest', styleRequest)
            styleCode += `\nimport ${JSON.stringify(styleRequest)}`;
        });
        return styleCode;
    }
}
function genScriptCode(descriptor, id) {
    let scriptCode = "";
    let script = compileScript(descriptor, { id });
    if (!script.lang) {
        scriptCode = rewriteDefault(script.content, "_sfc_main");
    }
    return scriptCode;
}
function genTemplateCode(descriptor, id) {
    let content = descriptor.template.content;
    const result = compileTemplate({ source: content, id });
    return result.code;
}
function parseVueRequest(id) {
    const [filename, querystring = ""] = id.split("?");
    let query = new URLSearchParams(querystring);
    return {
        filename,
        query,
    };
}
module.exports = vue;