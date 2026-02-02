const MagicString = require("magic-string");

function definePlugin(config) {
    return {
        name: "vite:define",
        transform(code) {
            const replacements = config.define || {};
            const replacementsKeys = Object.keys(replacements);
            const pattern = new RegExp(
                "(" + replacementsKeys.map((str) => str).join("|") + ")",
                "g"
            );
            const s = new MagicString(code);
            let hasReplaced = false;
            let match;
            while ((match = pattern.exec(code))) {
                hasReplaced = true;
                const start = match.index;
                const end = start + match[0].length;
                const replacement = "" + replacements[match[1]];
                s.overwrite(start, end, replacement);
            }
            if (!hasReplaced) {
                return null;
            }
            return { code: s.toString() };
        },
    };
}
module.exports = definePlugin;