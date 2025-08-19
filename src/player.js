class Player extends Character{
    characterName = 'Mewnbeam';
    size = 210;
    maxHp = 40;

    actionPoints = 3;
    manaPoints = 1;

    render() {
        super.render();
        this.el.style.bottom = '270rem';
        this.el.style.left = '50rem';
        this.el.classList.add('C--playerCharacter');

        this.resourceSprite.showAndRender(this.actionPoints, this.manaPoints);
    }

    resourceSprite = new class extends Sprite{
        makeEl() {
            return div('C--resources', [
                div('C--manaRow'),
                div('C--actionPointRow'),
            ]);
        }
        render(actionPoints, manaPoints) {
            setChildNumber(
                this.el.querySelector('.C--actionPointRow'),
                actionPoints,
                _ => div('C--costA'),
            );
            setChildNumber(
                this.el.querySelector('.C--manaRow'),
                manaPoints,
                _ => div('C--costM'),
            );
        }
    }

    pay(actionCost, manaCost) {
        this.actionPoints -= actionCost;
        this.manaPoints -= manaCost;
        this.render();
    }
};
