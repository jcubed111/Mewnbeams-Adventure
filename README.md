# possible optimizations:
* rewrite `function name(...) {` -> `const name = (...) => {`
* remove `window.` everywhere it appears
* move globals to top level, `document.body.hello` => `const B = document.body; b.hello`
