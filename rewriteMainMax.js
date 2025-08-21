const fs = require("fs");

const stdin = fs.readFileSync(0, "utf8"); // 0 = stdin

const replacePropStrings = [
    // 'getBoundingClientRect',
    // 'removeEventListener',
    // 'addEventListener',
    // 'forEach',
    // 'classList',
];

const prefix = `
    const DOC_BODY = document.body;
    const MATH = Math;
    const PROMISE = Promise;
`
    // + replacePropStrings.map(s => `let str_${s} = "${s}";`).join('');

let transformed = stdin
    .replace(/async function ([a-zA-Z]+) *\(([^)]*)\) *\{/g, 'const $1 = async ($2) => {')
    .replace(/function ([a-zA-Z]+) *\(([^)]*)\) *\{/g, 'const $1 = ($2) => {')
    .replace(/document\.body/g, 'DOC_BODY')
    .replace(/\bMath\b/g, 'MATH')
    .replace(/\bPromise\b/g, 'PROMISE')
;

for(s of replacePropStrings) {
    transformed = transformed.replace(
        new RegExp('\\?\\.' + s + '\\b', 'g'),
        `?.[str_${s}]`,
    );
    transformed = transformed.replace(
        new RegExp('\\.' + s + '\\b', 'g'),
        `[str_${s}]`,
    );
}

// Write all to stdout
fs.writeSync(1, prefix + transformed); // 1 = stdout
