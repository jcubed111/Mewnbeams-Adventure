class Player extends Character{
    characterName = 'Mewnbeam';
    size = 210;
    maxHp = 40;

    actionPoints;
    manaPoints;
    strength;

    reset() {
        player.manaPoints = INITIAL_MANA;
        player.actionPoints = ACTIONS_PER_ROUND;
        player.strength = 0;
        player.bleed = 0;
        this.render();
    }

    render() {
        super.render();
        this.el.style.bottom = '290rem';
        this.el.style.left = '150rem';
        this.el.classList.add('C--playerCharacter');

        this.resourceSprite.showAndRender(this.actionPoints, this.manaPoints);
    }

    hide() {
        this.resourceSprite.hide();
        super.hide();
    }

    resourceSprite = new class extends Sprite{
        makeEl() {
            return div('C--resources',
                div('C--actionPointRow'),
                div('C--manaRow'),
            );
        }
        render(actionPoints, manaPoints) {
            setChildNumber(
                this.el.querySelector('.C--actionPointRow'),
                actionPoints,
                _ => div('C--actionPointIcon'),
            );
            setChildNumber(
                this.el.querySelector('.C--manaRow'),
                manaPoints,
                _ => div('C--manaPointIcon'),
            );
        }
    }

    pay(actionCost, manaCost) {
        this.actionPoints -= actionCost;
        this.manaPoints -= manaCost;
        this.render();
    }
};
