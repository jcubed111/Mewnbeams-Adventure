const monsterLibrary = {
    BasicRat: class extends Character{
        characterName = 'Rat';
        maxHp = 1;
        size = 110;

        *getActionSequence() {
            yield* shuffleInPlace([
                new actions.Block(2),
                new actions.Attack(1),
                new actions.Attack(2),
            ]);
        }
    },
    RatWizard: class extends Character{
        characterName = 'Rat Wizard';
        maxHp = 3;
        size = 110;

        *getActionSequence() {
            yield new actions.Pass;
            yield new actions.Attack(4);
        }
    },
    RatGuard: class extends Character{
        characterName = 'Rat Guard';
        maxHp = 8;
        size = 150;
        guard = true;

        *getActionSequence() {
            yield* shuffleInPlace([
                new actions.Attack(2),
                new actions.Block(3),
                new actions.Block(5),
            ]);
        }
    },
}
