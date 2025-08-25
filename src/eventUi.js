

// choice menu mode bitmap
const Bit_darkBg = 1;
const Bit_unclickableCardList = 32;


const ChoiceMenuDefault = 0;
const ChoiceMenuDarkBg = 1;
const ChoiceMenuDarkBgNoClick = 2;

// A big fullscreen menu element for events, card lists, etc.
function showChoiceMenu(darkModeMode, textContent, heroPic, ...options) {
    // ~1.8%
    // not split -> centered
    // is split -> left
    // is split title -> centered

    // resolves with the index of the chosen option
    return new Promise(resolve => {
        const choiceMenuSprite = new class extends Sprite{
            makeEl() {
                const optionDivs = options.map(
                    (optionContent, i) =>
                        div(
                            (!darkModeMode || i == 0) && 'C--buttonLike',
                            optionContent,
                        )
                );

                optionDivs.forEach((el, i) => {
                    if(i == 0 || darkModeMode != 2) {
                        el.addEventListener('click', () => {
                            this.hide();
                            resolve(i);
                        });
                    }
                });


                return div(
                    darkModeMode
                        ? 'C--choiceMenuWrapper C--darkBlackMenuBack'
                        : 'C--choiceMenuWrapper',
                    div(
                        darkModeMode
                            ? 'C--choiceMenu'
                            : 'C--choiceMenu C--choiceMenuBordered',
                        div(
                            heroPic
                                ? 'C--choiceMenuTitle C--eventTextWithPic'
                                : 'C--choiceMenuTitle',
                            div('', textContent),
                            heroPic,
                        ),
                        div('C--choiceMenuOptions',
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
        await wait(i * 0.8 / parts.length);
        p.style.opacity = 1;
    });
    return plainElement('span', parts);
}

const witchPic = SpriteSheetPic(44, '#f40', 1);

function deathScreen() {
    return showChoiceMenu(ChoiceMenuDefault,
        [
            plainElement('h2', 'Defeat...'),
            fadeInText`Mewnbeam, I'm back! How was killing th--${br()}${br()}Oh. Oh dear.${br()}${br()}Let’s see, where’d I put that revivify potion...`,
        ],
        witchPic(),
        'Try Again',
    );
}

function victoryScreen() {
    return showChoiceMenu(ChoiceMenuDefault,
        [
            plainElement('h1', 'Victory!'),
            styledDiv('', {textAlign: 'left'},
                fadeInText`Mewnbeam, I'm back! How was killing the ${plainElement('b', `Rat King`)}? Tasty?${br()}${br()}I got you a treat for all your hard work!`,
            ),
        ],
        witchPic(),
        'Continue',
    );
}

async function cardRewardScreen(text, pic, cardInstances) {
    // Turn all card instances into arrays, to support multi card rewards
    const cardRewardArrays = cardInstances.map(c => [c].flat());

    const cardChoice = await showChoiceMenu(ChoiceMenuDefault,
        text,
        pic,
        ...cardRewardArrays.map(cards =>
            div('C--CardMultiReward',
                cards.map(c => c.asStaticElement())
            )
        ),
        "Hiisss! (Pass)",
    );

    if(cardChoice < cardRewardArrays.length) {
        cardManager.addToDeck(...cardRewardArrays[cardChoice]);
    };
}

const undiscoveredCard = new class extends Card{
    cardName = '???';
    primaryColor = '#444';

};

async function cardListViewScreen(cards, sort, allowCardClick, title, libraryView) {
    const ordered = sort
        // google closure compiler doesn't know about toSorted lol
        ? cards['toSorted'](
            (a, b) =>
                a.rarityOrder - b.rarityOrder
                || a.cardName.localeCompare(b.cardName)
        )
        : cards;
    // we subtract 1 to account for the back button and return the card index
    return -1 + await showChoiceMenu(allowCardClick ? ChoiceMenuDarkBg : ChoiceMenuDarkBgNoClick,
        div('',
            title,
            cards.length ? 0 : ' (Empty)',
            libraryView ? ` (${cards.filter(isCardDiscovered).length} / ${cards.length})` : '',
        ),
        ' ',  // provide a "pic" so we align the title text left
        'Back',
        ...ordered.map(card =>
            card.asStaticElement(
                allowCardClick,
                libraryView && !isCardDiscovered(card),
            ),
        ),
    );
}
