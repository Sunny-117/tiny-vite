const MagicString = require("magic-string")

function definePlugin (config) {
    return {
        name: 'define',
        transform(code) {
            const replacements = config.define || {}
            const replacementKeys = Object.keys(replacements)
            const pattern = new RegExp(`(${replacementKeys.map(str => str).join('|')})`, 'g')
            const ms = new MagicString(code)
            let hasReplaced = false
            let match
            while (match = pattern.exec(code)) {
                hasReplaced = true
                const start = match.index
                const end = start + match[0].length
                const replacement = '' + replacements[match[1]]
                ms.overwrite(start, end, replacement)
            }
            if (!hasReplaced) {
                return null;
            }

            return {
                code: ms.toString()
            }
        }
    }
}

module.exports = definePlugin