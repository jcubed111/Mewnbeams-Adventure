const br = () => {
    return plainElement('br');
}

const plainElement = (tagName, children = []) => {
    return styled(tagName, '', {}, children);
}

const div = (className = '', children = []) => {
    return styledDiv(className, {}, children);
}

const span = (className = '', children = []) => {
    return styled('span', className, {}, children);
}

const styledDiv = (className = '', style = {}, children = []) => {
    return styled("div", className, style, children);
}

const styled = (tagName = "div", className = "", style = {}, children = []) => {
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

const setChildren = (el, children) => {
    setChildNumber(el, 0);
    el.append(...children);
}

const range = end => [...Array(end).keys()];

const shuffleInPlace = (arr) => {
    for(let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

const wait = (tSec) => {
    return new Promise(resolve => setTimeout(resolve, tSec * 1000));
}

const setChildNumber = (parentEl, numChildren, makeChild) => {
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
