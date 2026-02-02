const { parse, compileScript, rewriteDefault, compileTemplate } = require('vue/compiler-sfc')

let content = `
<template>
    <h1>App</h1>
</template>

<script>
export default {
    name: 'App'
}
</script>
`

const result = parse(content, { filename: 'App.vue' })
let descriptor = result.descriptor
console.log(descriptor)

let script = compileScript(descriptor, { id: 'App.vue' })
console.log(script.content)

let res = rewriteDefault(script.content, '_sfc_main')
console.log(res);

const res2 = compileTemplate({ source: descriptor.template.content, id: "App.vue" })
console.log(res2.code)
