

// choice menu mode bitmap
const Bit_darkBg = 1;
const Bit_centeredTitle = 2;  // the title text is centered
const Bit_centeredOptions = 8;
const Bit_unclickableCardList = 32;


const ChoiceMenuTitle = Bit_centeredTitle | Bit_centeredOptions;
const ChoiceMenuTextEvent = 0;
const ChoiceMenuTextEventReward = Bit_centeredOptions;
const ChoiceMenuCardReward = Bit_centeredTitle | Bit_centeredOptions;
const ChoiceMenuCardList = Bit_darkBg;
const ChoiceMenuCardListNoClick = Bit_darkBg | Bit_unclickableCardList;

// A big fullscreen menu element for events, card lists, etc.
function showChoiceMenu(modeBitmap, textContent, heroPic, ...options) {
    // ~2.5%
    const darkBg = modeBitmap & Bit_darkBg;
    const centeredTitle = modeBitmap & Bit_centeredTitle;
    const centeredOptions = modeBitmap & Bit_centeredOptions;
    const unclickableCardList = modeBitmap & Bit_unclickableCardList;

    // resolves with the index of the chosen option
    return new Promise(resolve => {
        const choiceMenuSprite = new class extends Sprite{
            makeEl() {
                const optionDivs = options.map(
                    (optionContent, i) =>
                        div(
                            (!darkBg || i == 0) && 'C--buttonLike C--choiceMenuOptionButton',
                            optionContent,
                        )
                );

                optionDivs.forEach((el, i) => {
                    if(i == 0 || !unclickableCardList) {
                        el.addEventListener('click', () => {
                            this.hide();
                            resolve(i);
                        });
                    }
                });


                return div(darkBg ? 'C--choiceMenuWrapper C--darkBlackMenuBack' : 'C--choiceMenuWrapper',
                    div(darkBg ? 'C--choiceMenu' : 'C--choiceMenu C--choiceMenuBordered',
                        div(
                            centeredTitle
                                ? 'C--choiceMenuTitle C--centeredTitle'
                                : 'C--choiceMenuTitle C--leftTitle',
                            heroPic
                                ? div('C--eventTextWithPic',
                                    textContent,
                                    heroPic,
                                )
                                : textContent,
                        ),
                        div(
                            [
                                'C--choiceMenuOptions',
                                centeredOptions || 'C--leftOptions',
                            ].join(' '),
                            optionDivs,
                        ),
                    )
                );
            }
        }

        choiceMenuSprite.showAndRender();
    });
}

// Take a string, split it into words, then animate them in one at
// a time. Used as a tagged template, where each fill is an element (or string).
// Ex: fadeInText`This will show one word or ${div('', 'element')} at a time`
function fadeInText(textStringParts, ...els) {
    const parts = textStringParts.flatMap((part, i) => {
        return [
            ...part.split(/( )/g).map(p => span('', p)),
            span('', els[i]),
        ];
    });
    parts.forEach(async (p, i) => {
        p.style.opacity = 0;
        await wait(i * 0.02);
        p.style.opacity = 1;
    });
    return plainElement('span', parts);
}

const witchPic = SpriteSheetPic(44, '#f40', 1);

function deathScreen() {
    return showChoiceMenu(ChoiceMenuTextEventReward,
        fadeInText`Mewnbeam, I'm back! How was killing th--${br()}${br()}Oh. Oh dear.${br()}${br()}Let’s see, where’d I put that revivify potion...`,
        witchPic(),
        'Try Again',
    );
}

function victoryScreen() {
    return showChoiceMenu(ChoiceMenuTitle,
        div('',
            plainElement('h1', 'Victory!'),
            styledDiv('', {textAlign: 'left'},
                fadeInText`Mewnbeam, I'm back! How was killing the ${plainElement('b', `Rat King`)}? Tasty?${br()}${br()}I got you a treat for all your hard work!`,
            ),
        ),
        witchPic(),
        'Continue',
    );
}

async function cardListViewScreen(cards, sort, allowCardClick, title='') {
    const ordered = sort
        // google closure compiler doesn't know about toSorted lol
        ? cards['toSorted'](
            (a, b) =>
                a.rarityOrder - b.rarityOrder
                || a.cardName.localeCompare(b.cardName)
        )
        : cards;
    // we subtract 1 to account for the back button and return the card index
    return -1 + await showChoiceMenu(allowCardClick ? ChoiceMenuCardList : ChoiceMenuCardListNoClick,
        div('',
            title,
            cards.length ? 0 : 'No Cards',
        ),
        0,
        'Back',
        ...ordered.map(card => card.asStaticElement(allowCardClick)),
    );
}
