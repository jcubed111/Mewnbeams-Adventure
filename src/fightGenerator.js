function getFightGenerator() {
    const cardRewardRandGenerator = function*() {
        while(true) {
            yield* shuffleInPlace(
                // generate one number between 0 - 0.2, one from 0.2 - 0.4, etc.
                range(5).map(n => (n + Math.random()) / 5)
            );
        }
    }();
    const cardRewardRand = () => cardRewardRandGenerator.next().value;

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
    // need at least 4 of these
    const midTierGroupEnemyFights = shuffleInPlace([
        [new enemyLibrary.RatGuard, new enemyLibrary.Mouse],
        [new enemyLibrary.RatGuard, new enemyLibrary.PoisonRat],
        [new enemyLibrary.PoisonRat, new enemyLibrary.PoisonRat, new enemyLibrary.RatWizard],
        [new enemyLibrary.RatGuard, new enemyLibrary.RatWizard, new enemyLibrary.RatGuard],
        [new enemyLibrary.Mouse, new enemyLibrary.Mouse, new enemyLibrary.Mouse],
    ]);

    // Floors 11 - 14
    // need at least 3 of these
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
        //     cardRewards,
        // ];
        /**************/

        // Compute card rewards
        const cardsByTier = [[], [], []];
        cardLibrary
            .map(C => new C)
            .forEach(c => cardsByTier[c.rarityOrder]?.push(c));
        cardsByTier.forEach(shuffleInPlace);

        const rolledTiers = shuffleInPlace([
            cardRewardRand() > (0.1 + floorIndex / 40 ) ? 0 : 1,
            cardRewardRand() > (0.3 + floorIndex / 40 ) ? 0 : 1,
            cardRewardRand() > (0.15 + floorIndex / 20 ) ? 1 : 2,
        ]);
        const cardRewards = rolledTiers.map(tier => cardsByTier[tier].pop());

        // Get fight
        if(floorIndex < 4) {
            return [
                [
                    // one basic rat and one random easy enemy
                    new enemyLibrary.BasicRat,
                    introEnemyChoices.pop(),
                ],
                cardRewards,
            ]
        }

        // The first fight after the intro fights, we run
        // a mini boss to get players into something interesting.
        if(floorIndex < 7 && !hasFoughtMiniBoss1) {
            hasFoughtMiniBoss1 = true;
            const cards = cardRewards;
            return shuffleInPlace([
                [
                    [new enemyLibrary.Weasel],
                    [cards[0], new Card_WayOfTheWeasel, cards[1]],
                ],
                [
                    [new enemyLibrary.Rabbit],
                    [cards[0], new Card_RabbitsFoot, cards[1]],
                ],
                [
                    [new enemyLibrary.Beaver],
                    [cards[0], new Card_Dam, cards[1]],
                ],
            ])[0];
        }

        if(floorIndex < 10) {
            return [
                midTierGroupEnemyFights.pop(),
                cardRewards,
            ];
        }

        if(floorIndex < NUM_FLOORS - 1) {
            return [
                lateGameFights.pop(),
                cardRewards,
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
    }
}

const getThreeRandomTrinkets = () => shuffleInPlace(
    cardLibrary
        .map(C => new C)
        .filter(c => c instanceof TrinketCard)
).slice(0, 3);
