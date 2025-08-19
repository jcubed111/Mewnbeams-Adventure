const actions = {
    Pass: class{
        stringify() {
            return 'zZzZ';
        }
        run() {}
    },

    None: class{
        stringify() {
            return '\xA0';
        }
        run() {}
    },

    Attack: class{
        damage = 0;
        constructor(damage) {
            this.damage = damage;
        }
        stringify() {
            return `🗡️ ${this.damage}`;
        }
        run(monster) {
            monster.animateAttack();
            player.animateDamage(this.damage);
        }
    },

    Block: class{
        block = 0;
        constructor(block) {
            this.block = block;
        }
        stringify() {
            return `🛡️ ${this.block}`;
        }
        run(monster) {
            monster.animateAttack(-0.5);
            monster.gainBlock(this.block);
        }
    },
};
