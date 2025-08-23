// ~4%
const enemyLibrary = {
    /* Intro fight enemies */
    BasicRat: class extends Character{
        characterName = 'Rat';
        maxHp = 4;
        size = 130;
        pic = SpriteSheetPic(46, '#e11');

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
        size = 130;
        pic = SpriteSheetPic(46, '#5af');

        *getActionSequence() {
            yield actions.Pass;
            yield actions.Attack(4);
        }
    },
    PoisonRat: class extends Character{
        characterName = 'Poison Rat';
        maxHp = 3;
        size = 130;
        pic = SpriteSheetPic(46, '#1e1');

        *getActionSequence() {
            yield actions.Poison(2);
        }
    },

    /* Midgame mini bosses */
    Weasel: class extends Character{
        characterName = 'Weasel';
        maxHp = 15;
        size = 170;
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
        size = 130;
        pic = SpriteSheetPic(51, '#f20');

        // The first rabbit starts with a `summon` step, but new
        // rabbits summoned via rabbit have a two turn delay
        // before they summon.
        constructor(isNotFirst) {
            super();
            this.summonThisCycle = !isNotFirst;
        }

        *getActionSequence() {
            if(this.summonThisCycle) {
                yield actions.Summon('🐇', 0, new enemyLibrary.Rabbit(true));
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
        size = 170;

        *getActionSequence() {
            yield actions.Summon('🪵🪵', new enemyLibrary.Dam, new enemyLibrary.Dam);
            yield actions.Attack(3);
        }
    },
    Dam: class extends Character{
        characterName = 'Dam';
        maxHp = 1;
        size = 130;
        guard = true;

        *getActionSequence() {
            yield actions.None;
        }
    },

    /* Support enemies */
    RatGuard: class extends Character{
        characterName = 'Rat Guard';
        maxHp = 8;
        size = 170;
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
        maxHp = 5;
        size = 130;
        pic = SpriteSheetPic(45, '#e11');

        *getActionSequence() {
            yield* shuffleInPlace([
                actions.HealAll(2),
                // actions.Block(2),
                actions.Attack(2),
            ]);
        }
    },

    /* Late game unique enemies */
    Snake: class extends Character{
        characterName = 'Snake';
        maxHp = 15;
        size = 170;
        guard = true;

        async onStartOfTurn() {
            await super.onStartOfTurn();
            this.dodge += 1;
            this.render();
        }

        *getActionSequence() {
            for(let i = 0; true; i++) {
                yield actions.Poison(3);
                if(i == 0) {
                    yield actions.Summon('🐁', 0, new enemyLibrary.Mouse);
                }
                yield actions.Attack(shuffleInPlace([2, 3, 4])[0]);
            }
        }
    },

    /* Rat King */
    RatKing: class extends Character{
        characterName = 'Rat King';
        maxHp = 25;
        size = 270;

        *getActionSequence() {
            yield actions.Summon('🐀🐀', new enemyLibrary.BasicRat, new enemyLibrary.BasicRat);
            for(let i = 0; true; i++) {
                yield actions.Attack(5 + i);
                yield actions.HealAll(2);
                yield actions.Summon('🐀', new enemyLibrary.BasicRat, 0);
            }
        }
    },
}
