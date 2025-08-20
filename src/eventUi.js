
// A big fullscreen menu element for events, card lists, etc.
function showChoiceMenu(mode, mainContent, ...options) {
    // Modes:
    // 0 - centered menu, centered row of options
    // 1 - left menu, left aligned list of options, option show delay
    // 2 - left menu, centered row of options, option show delay
    // 3 - floating menu, dark black bg, no box, higher z index
    const extraClasses = [
        'C--centeredMenu',
        'C--leftMenu C--colOptions',
        'C--leftMenu',
        'C--leftMenu C--darkBlackMenuBack'
    ][mode];
    // resolves with the index of the chosen option
    return new Promise(resolve => {
        const choiceMenuSprite = new class extends Sprite{
            makeEl() {
                const optionDivs = options.map(
                    optionContent =>
                        div('C--buttonLike', [optionContent])
                );

                optionDivs.forEach(
                    (el, i) =>
                        el.addEventListener('click', () => {
                            this.hide();
                            resolve(i);
                        })
                );

                const optionsWrapper = div('C--choiceMenuOptions', optionDivs);
                if(mode != 0 && mode != 3) {
                    optionsWrapper.style.visibility = 'hidden';
                    wait(0.5).then(() => optionsWrapper.style.visibility = '');
                }

                return div('C--choiceMenuWrapper ' + extraClasses, [
                    div(mode == 3 ? 'C--choiceMenu' : 'C--choiceMenu C--choiceMenuBordered', [
                        div('C--choiceMenuTitle', [mainContent]),
                        styledDiv('', {flexGrow: 1}),
                        optionsWrapper,
                        styledDiv('', {flexGrow: 1}),
                    ])
                ]);
            }
        }

        choiceMenuSprite.showAndRender(resolve, mainContent, options);
    });
}

// Take a string, split it into words, then animate them in one at
// a time. Used as a tagged template, where each fill is an element (or string).
// Ex: fadeInText`This will show one word or ${div('', ['element'])} at a time`
function fadeInText(textStringParts, ...els) {
    const parts = textStringParts.flatMap((part, i) => {
        return [
            ...part.split(/( )/g).map(p => plainElement('span', [p])),
            plainElement('span', [els[i]]),
        ];
    });
    parts.forEach(async (p, i) => {
        p.style.opacity = 0;
        await wait(i * 0.02);
        p.style.opacity = 1;
    });
    return plainElement('span', parts);
}

function deathScreen() {
    return showChoiceMenu(3,
        fadeInText`Mewnbeam, I'm back! How was killing th--${br()}${br()}Oh. Oh dear.${br()}${br()}Let’s see, where’d I put that revivify potion...`,
        'Try Again',
    );
}

function victoryScreen() {
    return showChoiceMenu(0,
        div('', [
            plainElement('h1', ['Victory!']),
            styledDiv('', {textAlign: 'left'}, [
                fadeInText`Mewnbeam, I'm back! How was killing the ${plainElement('b', [`Rat King`])}? Tasty?${br()}${br()}I got you a treat for all your hard work!`,
            ]),
        ]),
        'Continue',
    );
}

function cardListViewScreen(cards, sort) {
    const ordered = sort
        // google closure compiler doesn't know about toSorted lol
        ? cards['toSorted'](
            (a, b) =>
                a.rarityOrder - b.rarityOrder
                || a.cardName.localeCompare(b.cardName)
        )
        : cards;
    return showChoiceMenu(3,
        div('C--cardList',
            cards.length
                ? ordered.map(card => card.asStaticElement())
                : ['No Cards'],
        ),
        'Back',
    );
}
