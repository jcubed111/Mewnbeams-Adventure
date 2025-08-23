function getFightGenerator() {
    // floors 1 - 4
    const introEnemyChoices = shuffleInPlace([
        // need at least 4 of these
        new enemyLibrary.BasicRat,
        new enemyLibrary.PoisonRat,
        new enemyLibrary.RatWizard,
        new enemyLibrary.Mouse,
    ]);

    // A mini boss will fill the first fight after floor 4 (likely floor 5)
    let hasFoughtMiniBoss1 = false;

    // floors 6 - 10
    // need at least 5 of these
    const midTierGroupEnemyFights = shuffleInPlace([
        [new enemyLibrary.RatGuard, new enemyLibrary.Mouse],
        [new enemyLibrary.RatGuard, new enemyLibrary.PoisonRat],
        [new enemyLibrary.PoisonRat, new enemyLibrary.PoisonRat, new enemyLibrary.RatWizard],
        [new enemyLibrary.RatGuard, new enemyLibrary.RatWizard, new enemyLibrary.RatGuard],
        [new enemyLibrary.Mouse, new enemyLibrary.Mouse, new enemyLibrary.Mouse],
    ]);

    // Floors 11 - 14
    // need at least 4 of these
    const lateGameFights = shuffleInPlace([
        [  // mini menagerie
            new enemyLibrary.BasicRat,
            new enemyLibrary.RatGuard,
            new enemyLibrary.RatWizard,
            new enemyLibrary.Mouse,
            new enemyLibrary.PoisonRat,
        ],
        [   // rabits with healing
            new enemyLibrary.Rabbit,
            new enemyLibrary.Rabbit,
            new enemyLibrary.Mouse,
        ],
        [   // weasel with healing
            new enemyLibrary.Weasel,
            new enemyLibrary.Mouse,
        ],
        [
            new enemyLibrary.Snake,
        ],
    ]);

    return floorIndex => {
        // Returns [enemies, card reward choices]
        // Both enemies and cardRewardChoices are instance arrays, not constructor arrays.

        /* test fight */
        // return [
        //     [
        //         // one basic rat and one random easy enemy
        //         // new enemyLibrary.Rabbit,
        //         new enemyLibrary.Beaver,
        //     ],
        //     getCardRewards(floorIndex),
        // ];
        /**************/


        if(floorIndex < 4) {
            return [
                [
                    // one basic rat and one random easy enemy
                    new enemyLibrary.BasicRat,
                    introEnemyChoices.pop(),
                ],
                getCardRewards(floorIndex),
            ]
        }

        // The first fight after the intro fights, we run
        // a mini boss to get players into something interesting.
        if(floorIndex < 7 && !hasFoughtMiniBoss1) {
            hasFoughtMiniBoss1 = true;
            const cards = getCardRewards(floorIndex);
            return shuffleInPlace([
                [
                    [new enemyLibrary.Weasel],
                    [cards[0], new CARD_WAY_OF_THE_WEASEL, cards[1]],
                ],
                [
                    [new enemyLibrary.Rabbit],
                    [cards[0], new CARD_RABBITS_FOOT, cards[1]],
                ],
                [
                    [new enemyLibrary.Beaver],
                    [cards[0], new CARD_DAM, cards[1]],
                ],
            ])[0];
        }

        if(floorIndex < 10) {
            return [
                midTierGroupEnemyFights.pop(),
                getCardRewards(floorIndex),
            ];
        }

        if(floorIndex < NUM_FLOORS - 1) {
            return [
                lateGameFights.pop(),
                getCardRewards(floorIndex),
            ];
        }

        // Final boss
        return [
            [
                // one basic rat and one random easy enemy
                new enemyLibrary.RatGuard,
                new enemyLibrary.RatKing,
                new enemyLibrary.Mouse,
                new enemyLibrary.RatGuard,
            ],
            [],
        ];

        // return [
        //     [
        //         new enemyLibrary.BasicRat,
        //         new enemyLibrary.RatGuard,
        //         new enemyLibrary.RatWizard,
        //         new enemyLibrary.Mouse,
        //         new enemyLibrary.PoisonRat,
        //     ],
        //     getCardRewards(floorIndex),
        // ];
    }
}

function getCardRewards(floorIndex) {
    const cardsByTier = [[], [], []];
    cardLibrary
        .map(C => new C)
        .forEach(c => cardsByTier[c.rarityOrder]?.push(c));
    cardsByTier.forEach(shuffleInPlace);

    return range(3).map(i => {
        // This function:
        //     floor( 2.4 * random() ^ goodness )
        // approximates a weighted random.
        // At goodness=1.7, it gives:
        //     60% often => 0  (common)
        //     30% often => 1  (rare)
        //     10% often => 2  (legendary)
        // At goodness=0.9, it gives:
        //     38% often => 0  (common)
        //     43% often => 1  (rare)
        //     19% often => 2  (legendary)
        const goodnessFactor = 1.7 - 0.8 * (floorIndex / (NUM_FLOORS - 1));
        const rolledRarity = ~~(2.4 * Math.random() ** goodnessFactor);
        return cardsByTier[rolledRarity].pop();
    });
}

const getThreeRandomTrinkets = () => shuffleInPlace(
    cardLibrary
        .map(C => new C)
        .filter(c => c instanceof TrinketCard)
).slice(0, 3);
