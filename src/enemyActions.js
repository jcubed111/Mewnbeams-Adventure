// ~2.5%

const actions = {
    // All actions are: (...props) => [displayString: string, run: (enemy, allEnemies) => void]
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
        enemy => {
            enemy.animateAttack();
            player.animateDamage(damage);
        },
    ],

    Poison: damage => [
        `🧪 ${damage}`,
        enemy => {
            enemy.animateAttack();
            player.gainBleed(damage);
        },
    ],

    Block: block => [
        `🛡️ ${block}`,
        enemy => {
            enemy.animateAttack(-0.5);
            enemy.gainBlock(block);
        },
    ],

    BlockAll: block => [
        `◄🛡️ ${block}►`,
        (enemy, allEnemies) => {
            enemy.animateAttack(-0.5);
            allEnemies.forEach(m => m.gainBlock(block));
        },
    ],

    HealAll: heal => [
        `◄💖 ${heal}►`,
        (enemy, allEnemies) => {
            enemy.animateAttack(-0.5);
            allEnemies.forEach(m => m.heal(heal));
        },
    ],

    Summon: (icon, left, right) => [
        `+${icon}`,
        async (enemy) => {
            const i = enemyManager.activeEnemies.indexOf(enemy);
            if(right && enemyManager.activeEnemies.length < ENEMY_MAX) {
                // we need to clear the action first so we don't waste part of
                // the action sequence on the intro animation
                await enemy.animateAttack(0, 1);
                right.clearAction();
                await enemyManager.animateIn([right], i + 1);
            }
            if(left && enemyManager.activeEnemies.length < ENEMY_MAX) {
                // we need to clear the action first so we don't waste part of
                // the action sequence on the intro animation
                await enemy.animateAttack(0, 0);
                left.clearAction();
                await enemyManager.animateIn([left], i);
            }
        },
    ],
};
