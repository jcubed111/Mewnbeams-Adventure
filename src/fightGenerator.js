function getFightGenerator() {
    const introMonsterChoices = shuffleInPlace([
        new monsterLibrary.BasicRat,
        new monsterLibrary.PoisonRat,
        new monsterLibrary.RatWizard,
    ]);

    // The first fight after the intro fights, we run
    // a mini boss to get players into something interesting.
    let hasFoughtMiniBoss1 = false;

    return floorIndex => {
        // Returns [monsters, card reward choices]
        // Both monsters and cardRewardChoices are instance arrays, not constructor arrays.

        if(floorIndex < 3) {
            return [
                [
                    // one basic rat and one random easy enemy
                    new monsterLibrary.BasicRat,
                    introMonsterChoices.pop(),
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
                        new monsterLibrary.Weasel,
                    ],
                    [cards[0], new cardLibrary.WayOfTheWeasel, cards[1]],
                ],
                [
                    [
                        new monsterLibrary.Rabbit,
                    ],
                    [cards[0], new cardLibrary.RabbitsFoot, cards[1]],
                ],
                [
                    [
                        new monsterLibrary.Beaver,
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
                    new monsterLibrary.RatGuard,
                    new monsterLibrary.RatKing,
                    new monsterLibrary.RatGuard,
                ],
                [],
            ];
        }

        return [
            [
                new monsterLibrary.BasicRat,
                new monsterLibrary.RatGuard,
                new monsterLibrary.RatWizard,
                new monsterLibrary.PoisonRat,
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

    return range(0, numberOfRewards).map(i => {
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
