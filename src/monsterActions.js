const actions = {
    // All actions are: (...props) => [displayString: string, run: (monster, allMonsters) => void]
    // Except the basic ones which are just static values
    Pass: [
        '-',
        m => 0,
    ],

    None: [
        '\xA0',  // nbsp
        m => 0,
    ],

    Attack: damage => [
        `🗡️ ${damage}`,
        monster => {
            monster.animateAttack();
            player.animateDamage(damage);
        },
    ],

    Poison: damage => [
        `🧪 ${damage}`,
        monster => {
            monster.animateAttack();
            player.gainBleed(damage);
        },
    ],

    Block: block => [
        `🛡️ ${block}`,
        monster => {
            monster.animateAttack(-0.5);
            monster.gainBlock(block);
        },
    ],

    BlockAll: block => [
        `🛡️ ${block} All`,
        (monster, allMonsters) => {
            monster.animateAttack(-0.5);
            allMonsters.forEach(m => m.gainBlock(block));
        },
    ],

    Summon: (left, right) => [
        `Summon`,
        async (monster) => {
            const i = enemyManager.activeEnemies.indexOf(monster);
            if(right) {
                // we need to clear the action first so we don't waste part of
                // the action sequence on the intro animation
                right.clearAction();
                await enemyManager.animateIn([right], i + 1);
            }
            if(left) {
                // we need to clear the action first so we don't waste part of
                // the action sequence on the intro animation
                left.clearAction();
                await enemyManager.animateIn([left], i);
            }
        },
    ],
};
