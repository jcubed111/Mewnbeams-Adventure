const monsterLibrary = {
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
    PoisonRat: class extends Character{
        characterName = 'Poison Rat';
        maxHp = 2;
        size = 110;

        *getActionSequence() {
            yield actions.Poison(2);
        }
    },
}
