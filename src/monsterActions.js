const actions = {
    Pass: class{
        displayString() {
            return 'zZzZ';
        }
        run() {}
    },

    None: class{
        displayString() {
            return '\xA0';  // nbsp
        }
        run() {}
    },

    Attack: class{
        damage = 0;
        constructor(damage) {
            this.damage = damage;
        }
        displayString() {
            return `🗡️ ${this.damage}`;
        }
        run(monster) {
            monster.animateAttack();
            player.animateDamage(this.damage);
        }
    },

    Poison: class{
        damage = 0;
        constructor(damage) {
            this.damage = damage;
        }
        displayString() {
            return `🧪 ${this.damage}`;
        }
        run(monster) {
            monster.animateAttack();
            player.gainBleed(this.damage);
        }
    },

    Block: class{
        block = 0;
        constructor(block) {
            this.block = block;
        }
        displayString() {
            return `🛡️ ${this.block}`;
        }
        run(monster) {
            monster.animateAttack(-0.5);
            monster.gainBlock(this.block);
        }
    },

    BlockAll: class{
        block = 0;
        constructor(block) {
            this.block = block;
        }
        displayString() {
            return `🛡️ ${this.block} All`;
        }
        run(monster, allMonsters) {
            monster.animateAttack(-0.5);
            allMonsters.forEach(m => m.gainBlock(this.block));
        }
    },
};
