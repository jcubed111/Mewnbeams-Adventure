// ~2.5%

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
        `◄ 🛡️ ${block} ►`,
        (monster, allMonsters) => {
            monster.animateAttack(-0.5);
            allMonsters.forEach(m => m.gainBlock(block));
        },
    ],

    HealAll: heal => [
        `◄ 💖 ${heal} ►`,
        (monster, allMonsters) => {
            monster.animateAttack(-0.5);
            allMonsters.forEach(m => m.heal(heal));
        },
    ],

    Summon: (icon, left, right) => [
        `+${icon}`,
        async (monster) => {
            const i = enemyManager.activeEnemies.indexOf(monster);
            if(right && enemyManager.activeEnemies.length < ENEMY_MAX) {
                // we need to clear the action first so we don't waste part of
                // the action sequence on the intro animation
                await monster.animateAttack(0, 1);
                right.clearAction();
                await enemyManager.animateIn([right], i + 1);
            }
            if(left && enemyManager.activeEnemies.length < ENEMY_MAX) {
                // we need to clear the action first so we don't waste part of
                // the action sequence on the intro animation
                await monster.animateAttack(0, 0);
                left.clearAction();
                await enemyManager.animateIn([left], i);
            }
        },
    ],
};
