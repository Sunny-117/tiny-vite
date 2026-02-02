const fs = require('fs')
const { parse, compileScript, compileStyleAsync, compileTemplate, rewriteDefault } = require('vue/compiler-sfc')

function vue() {
    return {
        name: 'vue',
        config(config) {
            return {
                define: {
                    __VUE_OPTIONS_API__: true,
                    __VUE_PROD_DEVTOOLS__: false,
                }
            }
        },
        async load(id) {
            const { filename, query } = parseVueRequest(id)
            if (query.has('vue')) {
                const descriptor = await getDescriptor(filename)
                if (query.get('type') === 'style') {
                    let block = descriptor.styles[Number(query.get('index'))]
                    if (block) {
                        return {
                            code: block.content
                        }
                    }
                }
            }
            return null;
        },
        // 此插件的核心功能是把App.vue的原始内容编译成js内容返回
        async transform(code, id) {
            const { filename, query } = parseVueRequest(id)
            if (filename.endsWith('.vue')) {
                let result
                if (query.get('type') === 'style') {
                    console.log('asmlsm', filename)
                    const descriptor = await getDescriptor(filename)
                    result = await transformStyle(code, descriptor, query.get('index'))
                } else {
                    result = await transformMain(code, filename)
                }
                return result
            }
            return null
        }
    }
}

async function transformStyle(code, descriptor, index) {
    const block = descriptor.styles[index]
    const result = await compileStyleAsync({
        filename: descriptor.filename,
        source: code,
        id: `data-v-${descriptor.id}`,
        scoped: block.scoped
    })
    let styleCode = result.code
    // 将样式文件转为js代码
    const injectCode = [
        `let style = document.createElement('style');`,
        `style.innerHTML = ${JSON.stringify(styleCode)}`,
        `document.head.appendChild(style)`
    ].join('\n')

    return {
        code: injectCode
    }
}

async function transformMain(source, filename) {
    console.log(filename, 'filenamefilename')
    const descriptor = await getDescriptor(filename)
    const scriptCode = getScriptCode(descriptor, filename)
    const templateCode = genTempalteCode(descriptor, filename)
    const styleCode = genStyleCode(descriptor, filename)
    console.log(styleCode, 'styleCodestyleCode')
    let resolveCode = [
        styleCode,
        templateCode,
        scriptCode,
        `_sfc_main.render=render`,
        `export default _sfc_main`
    ].join('\n')

    return {
        code: resolveCode
    }
}

function genStyleCode(descriptor, filename) {
    console.log(filename, 'asmkslakm')
    let styleCode = ''
    if (descriptor.styles.length) {
        descriptor.styles.forEach((style, index) => {
            const query = `?vue&type=style&index=${index}&lang.css`
            const styleRequest = (filename + query).replace(/\\/g, '/')
            console.log({filename, styleRequest}, 'styleRequeststyleRequest')
            styleCode += `\nimport ${JSON.stringify(styleRequest)}`
        })
    }
    return styleCode
}

function genTempalteCode(descriptor, filename) {
    const content = descriptor.template.content
    const result = compileTemplate({ source: content, id: filename })
    return result.code
}

function getScriptCode(descriptor, filename) {
    let scriptCode = ''
    let script = compileScript(descriptor, { id: filename })
    scriptCode = rewriteDefault(script.content, '_sfc_main')
    return scriptCode
}

async function getDescriptor(filename) {
    const content = await fs.promises.readFile(filename, 'utf-8')
    const result = parse(content, { filename })
    let descriptor = result.descriptor
    return descriptor
}

module.exports = vue

function parseVueRequest(id) {
    const [filename, querystring = ''] = id.split('?')
    let query = new URLSearchParams(querystring)

    return {
        filename, query
    }
}