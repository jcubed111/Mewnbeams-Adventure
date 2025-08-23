function getFightGenerator() {
    const introEnemyChoices = shuffleInPlace([
        new enemyLibrary.BasicRat,
        new enemyLibrary.PoisonRat,
        new enemyLibrary.RatWizard,
    ]);

    // The first fight after the intro fights, we run
    // a mini boss to get players into something interesting.
    let hasFoughtMiniBoss1 = false;

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


        if(floorIndex < 3) {
            return [
                [
                    // one basic rat and one random easy enemy
                    new enemyLibrary.BasicRat,
                    introEnemyChoices.pop(),
                ],
                getCardRewards(floorIndex),
            ]
        }

        if(floorIndex < 7 && !hasFoughtMiniBoss1) {
            hasFoughtMiniBoss1 = true;
            const cards = getCardRewards(floorIndex, 2);
            const chance = ~~(Math.random() * 3);
            return [
                [
                    [
                        new enemyLibrary.Weasel,
                    ],
                    [cards[0], new cardLibrary.WayOfTheWeasel, cards[1]],
                ],
                [
                    [
                        new enemyLibrary.Rabbit,
                    ],
                    [cards[0], new cardLibrary.RabbitsFoot, cards[1]],
                ],
                [
                    [
                        new enemyLibrary.Beaver,
                    ],
                    [cards[0], new cardLibrary.Dam, cards[1]],
                ],
            ][chance];
        }

        // Final boss
        if(floorIndex == NUM_FLOORS - 1) {
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
        }

        return [
            [
                new enemyLibrary.BasicRat,
                new enemyLibrary.RatGuard,
                new enemyLibrary.RatWizard,
                new enemyLibrary.Mouse,
                new enemyLibrary.PoisonRat,
            ],
            getCardRewards(floorIndex),
        ];
    }
}

function getCardRewards(floorIndex, numberOfRewards = 3) {
    const cardsByTier = [[], [], []];
    [...Object.values(cardLibrary)]
        .map(C => new C)
        .forEach(c => cardsByTier[c.rarityOrder]?.push(c));
    cardsByTier.forEach(shuffleInPlace);

    return range(numberOfRewards).map(i => {
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
    [...Object.values(cardLibrary)]
        .map(C => new C)
        .filter(c => c instanceof TrinketCard)
).slice(0, 3);
