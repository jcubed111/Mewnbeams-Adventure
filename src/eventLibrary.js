const eventLibrary = [
    // Need at least 5 events to guaranteed not run out
    async () => {
        const spellbook = new Card_Spellbook;
        const spellbookmark = new Card_Spellbookmark;
        await cardRewardScreen(
            [
                plainElement('h2', 'The Library'),
                fadeInText`Short-Tongue loves her spell book, but maybe that ribbon is more my jam...`,
            ],
            spellbook.pic(),
            [spellbook, spellbookmark],
        );
    },
    async () => {
        const knapsack = new Card_Knapsack;
        await cardRewardScreen(
            [
                plainElement('h2', 'The Woods'),
                fadeInText`How’d I end up outside? Oh well, the Rat King isn't going anywhere.${br()}${br()}At least I remembered my knapsack!`,
            ],
            knapsack.pic(),
            [knapsack],
        );
    },
    async () => {
        const cards = [
            new Card_Curse,
            new Card_Curse,
            new Card_DarkBargain,
        ];
        await cardRewardScreen(
            [
                plainElement('h2', 'The Sunroom'),
                fadeInText`Who summons a demon in the sunroom??${br()}${br()}This room is clearly made for napping.`,
            ],
            cards[2].pic(),
            [cards],
        );
    },
    async () => {
        const cards = [
            [new Card_Zoomies, new Card_SeeGhost],
            [new Card_ConveneWithSpirits],
        ];
        await cardRewardScreen(
            [
                plainElement('h2', 'A Haunting'),
                fadeInText`Is someone there? Do you have treats?`,
            ],
            cards[1][0].pic(),
            cards,
        );
    },
    async () => {
        const cards = [
            [new Card_Paw, new Card_Paw],
            [new Card_SpiritScratch],
        ];
        await cardRewardScreen(
            [
                plainElement('h2', 'Closed Door'),
                fadeInText`How ${plainElement('b', 'dare')} she!`,
            ],
            new Card_Curse().pic(),
            cards,
        );
    },
    async () => {
        const cards = [
            [new Card_Ratsbane],
            [new Card_VampireBatExtract],
            [new Card_Toadstool],
        ];
        await cardRewardScreen(
            [
                plainElement('h2', 'Brewery'),
                fadeInText`So many things to knock on the floor, so little time.`,
            ],
            cards[0][0].pic(),
            cards,
        );
    },
];
