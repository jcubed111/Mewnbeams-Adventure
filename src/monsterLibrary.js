const monsterLibrary = {
    /* Intro fight monsters */
    BasicRat: class extends Character{
        characterName = 'Rat';
        maxHp = 4;
        size = 110;

        *getActionSequence() {
            yield* shuffleInPlace([
                actions.Block(2),
                actions.Attack(1),
                actions.Attack(2),
            ]);
        }
    },
    RatWizard: class extends Character{
        characterName = 'Rat Wizard';
        maxHp = 3;
        size = 110;

        *getActionSequence() {
            yield actions.Pass;
            yield actions.Attack(4);
        }
    },
    PoisonRat: class extends Character{
        characterName = 'Poison Rat';
        maxHp = 3;
        size = 110;

        *getActionSequence() {
            yield actions.Poison(2);
        }
    },

    /* Midgame mini bosses */
    Weasel: class extends Character{
        characterName = 'Weasel';
        maxHp = 15;
        size = 150;
        pic = SpriteSheetPic(50, '#c76d24');

        *getActionSequence() {
            yield* shuffleInPlace([
                actions.Attack(2),
                actions.Attack(3),
                actions.Attack(4),
            ]);
        }

        afterUnblockedDamage() {
            this.dodge = 3;
        }
    },
    Rabbit: class extends Character{
        characterName = 'Rabbit';
        maxHp = 8;
        size = 110;

        // The first rabbit starts with a `summon` step, but new
        // rabbits summoned via rabbit have a two turn delay
        // before they summon.
        constructor(isNotFirst) {
            super();
            this.summonThisCycle = !isNotFirst;
        }

        *getActionSequence() {
            if(this.summonThisCycle) {
                yield actions.Summon('🐇', 0, new monsterLibrary.Rabbit(true));
            }
            this.summonThisCycle = true;
            yield actions.Attack(2);
            // yield actions.Attack(2);
            if(Math.random() < 0.5) {
                yield actions.Attack(2);
            }
        }
    },
    Beaver: class extends Character{
        characterName = 'Beaver';
        maxHp = 15;
        size = 150;

        *getActionSequence() {
            yield actions.Summon('🪵🪵', new monsterLibrary.Dam, new monsterLibrary.Dam);
            yield actions.Attack(3);
        }
    },
    Dam: class extends Character{
        characterName = 'Dam';
        maxHp = 1;
        size = 110;
        guard = true;

        *getActionSequence() {
            yield actions.None;
        }
    },

    /* Support enemies */
    RatGuard: class extends Character{
        characterName = 'Rat Guard';
        maxHp = 8;
        size = 150;
        guard = true;

        *getActionSequence() {
            yield* shuffleInPlace([
                actions.Attack(2),
                actions.BlockAll(2),
                actions.Block(5),
            ]);
        }
    },

    Mouse: class extends Character{
        characterName = 'Mouse';
        maxHp = 7;
        size = 110;

        *getActionSequence() {
            yield* shuffleInPlace([
                actions.HealAll(2),
                // actions.Block(2),
                actions.Attack(2),
            ]);
        }
    },

    /* Rat King */
    RatKing: class extends Character{
        characterName = 'Rat King';
        maxHp = 25;
        size = 250;

        *getActionSequence() {
            yield* shuffleInPlace([
                actions.Attack(7),
                actions.Block(7),
                // actions.Attack(2),
            ]);
        }
    },
}
