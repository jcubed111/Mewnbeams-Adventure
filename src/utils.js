function br() {
    return plainElement('br');
}

function plainElement(tagName, children = []) {
    return styled(tagName, '', {}, children);
}

function div(className = '', children = []) {
    return styledDiv(className, {}, children);
}

function styledDiv(className = '', style = {}, children = []) {
    return styled("div", className, style, children);
}

function styled(tagName = "div", className = "", style = {}, children = []) {
    const el = document.createElement(tagName);
    el.className = className;

    // This loop works for `-` properties
    for(const k in style) {
        el.style.setProperty(k, style[k]);
    }
    // This works for all other properties
    Object.assign(el.style, style);

    el.append(...children.filter(c => c));
    return el;
}

function range(start, end) {
    return Array(end - start).fill(0).map((_, i) => i + start);
}

function shuffleInPlace(arr) {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

function wait(tSec) {
    return new Promise(resolve => setTimeout(resolve, tSec * 1000));
}

function setChildNumber(parentEl, numChildren, makeChild) {
    // adds/removes children from parentEl to ensure there
    // are exactly numChildren present.
    // Uses the `makeChild` callback to generate new children.
    const liveChildList = parentEl.children;

    while(liveChildList.length > numChildren) {
        parentEl.lastChild.remove();
    }
    while(liveChildList.length < numChildren) {
        parentEl.appendChild(makeChild());
    }
}
