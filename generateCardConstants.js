const fs = require("fs");

const stdin = fs.readFileSync(0, "utf8").replace(/\/\/[^\n]*\n/g, '');

// pluck out card names with their index
const numCards = [...stdin.matchAll(/class extends [a-zA-Z]+Card/g)].length;
const cardNames =
    [...stdin.matchAll(/cardName *= *("[^"]+"|'[^']+'|`[^`]+`)/g)]
    .map(match =>
        match[1]
            .slice(1, -1)
            // .replace(/ +/g, '_')
            .replace(/[^a-zA-Z0-9 ]+/g, '')
            .toLowerCase()
            .replace(/(^| )[a-z]/g, m => m.toUpperCase())
            .replace(/ /g, '')
    )
    .map((cardConstant, cardIndex) =>
        `const Card_${cardConstant} = cardLibrary[${cardIndex}];`,
    );

fs.writeSync(1, cardNames.join('\n')); // stdout

if(cardNames.length != numCards) {
    throw new Error(`Mismatched number of cards vs cardNames detected in card library. Make sure every card has a name.`);
}

