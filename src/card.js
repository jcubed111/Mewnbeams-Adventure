
class Card extends Sprite{
    pic = SpriteSheetPic(0, '#f0a');
    // Universal props
    cardName = '?';
    primaryColor = '#f00';
    actionCost = 1;
    manaCost = 0;

    /* Render Methods */
    asStaticElement() {
        // returns a view only version of this card for showing
        // in deck/reward selection/etc.
        const clone = new this.constructor();
        clone.el = clone.makeEl();
        clone.render(true);
        clone.el.style.position = 'relative';
        clone.el.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
        return clone.el;
    }

    _cardTextDiv;
    makeEl() {
        return div('C--card', [
            div('C--actionPointIcon', ['' + this.actionCost]),
            this.manaCost > 0 && div('C--manaPointIcon', ['' + this.manaCost]),
            this.pic(),
            styledDiv(
                'C--cardName',
                {backgroundColor: this.primaryColor},
                [this.cardName],
            ),
            this._cardTextDiv = div('C--cardText'),
        ]);
    }

    render(standalone) {
        this.el.classList.toggle('C--unplayable', !(standalone ?? this.playable()));
        setChildren(
            this._cardTextDiv,
            this.getTextLines(standalone).map(d => div('', [d])),
        );
    }

    setHandPosition(index, outOf, activated, dx, dy) {
        // card width is 200rem, view is 1000rem wide.
        const rotateNormalized = outOf == 1 ? 0 : -1 + 2 * (index / (outOf - 1));

        const bottomRem = (activated ? 55 : 5) - 20 * rotateNormalized ** 2;
        const leftRem = outOf <= 5
            // gap between cards is 10rem, with 5rem on each side at limit
            ? 505 + 200 * (index - outOf / 2)
            // 5rem on each side
            : 5 + (800 / (outOf - 1)) * index;

        this.el.style.zIndex = activated ? 25 : (10 + index);
        this.el.style.transform = `rotate(${5 * rotateNormalized}deg)`;
        this.el.style.left = `calc(${leftRem}rem + ${dx}px)`;
        this.el.style.bottom = `calc(${bottomRem}rem - ${dy}px)`;
        this.el.classList.toggle('C--active', activated);
        this.el.classList.remove('C--faceDown');
    }

    setDrawPosition() {
        this.el.style.zIndex = 25;
        this.el.style.transform = `rotate(0deg)`;
        this.el.style.left = '-250rem';
        this.el.style.bottom = '-100rem';
        this.el.classList.remove('C--active');
        this.el.classList.add('C--faceDown');
    }

    // pick a static (but random) discard spot so we don't change it
    // every render.
    _discardSpot = range(0, 2).map(_ => Math.random() * 150 - 75);
    setDiscardPosition() {
        const [dx, dy] = this._discardSpot;
        this.el.style.zIndex = 25;
        this.el.style.transform = `rotate(0deg)`;
        this.el.style.left = `${dx + 1100}rem`;
        this.el.style.bottom = `${dy - 100}rem`;
        this.el.classList.remove('C--active');
        this.el.classList.remove('C--faceDown');
    }

    setExhaustedPosition() {
        this.fadeOut();
    }

    /* Game Methods */
    isTargeted() {
        // Whether this card targets a specific enemy
        return !this.toAll && (
            this.damage != undefined
            || this.bleed != undefined
            || this.fear != undefined
        );
    }

    playable() {
        return player.manaPoints >= this.manaCost
            && player.actionPoints >= this.actionCost;
    }

    /* Card Effects */
    /* roughly in display order */
    // Numbers use `undefined` so that the value `0` is
    // available, ie `Attack 0` is a valid card.

    // NON-PLAY EFFECTS (not used in the play method)
    // makes the card hit all enemies
    toAll = false;
    // exhaust after playing
    exhaust = false;

    // ENEMY EFFECTS
    // damage?: number
    damage;
    // bleed?: number - damage per turn, decay 1 per turn
    bleed;
    // fear?: number - reduces next attack by X, decay all
    fear;

    // SELF EFFECTS
    // gainActions?: number - gain action points
    gainActions;
    // gainMana?: number - gain mana
    gainMana;
    // selfHeal?: number - heal for this amount
    selfHeal;
    // gainStrength?: number
    gainStrength;
    // draw?: number - draw more cards
    draw;

    getTextLines(standalone) {
        const toAllText = this.toAll ? ' to All' : '';
        return [
            this.damage != undefined &&
                `Attack ${
                    this.damage
                    + (standalone ? 0 : player.strength)
                }${toAllText}`,

            this.bleed != undefined &&
                `Bleed ${this.bleed}${toAllText}`,

            this.fear != undefined &&
                `Scare ${this.fear}${toAllText}`,


            this.gainActions != undefined &&
                `Gain ${this.gainActions} Actions`,

            this.gainMana != undefined &&
                `Gain ${this.gainMana} Mana`,

            this.selfHeal != undefined &&
                `Heal ${this.selfHeal}`,

            this.gainStrength != undefined &&
                `Attack does +${this.gainStrength} damage`,

            this.draw != undefined &&
                `Draw ${this.draw}`,

            this.exhaust &&
                `Exhaust`,
        ].filter(l => l);
    }

    async play(targets) {
        if(this.damage != undefined) {
            targets.forEach(t => t.animateDamage(this.damage + player.strength));
        }
        if(this.bleed != undefined) {
            targets.forEach(t => t.gainBleed(this.bleed));
        }
        // TODO: fear

        if(this.gainActions != undefined) {
            player.pay(-this.gainActions, 0);
        }
        if(this.gainMana != undefined) {
            player.pay(0, -this.gainMana);
        }
        if(this.selfHeal) {
            player.heal(this.selfHeal);
        }
        if(this.gainStrength) {
            player.strength += this.gainStrength;
            player.render();
            cardManager.render();
        }
        if(this.draw) {
            await cardManager.draw(this.draw);
        }
    }
}

class ItemCard extends Card{
    primaryColor = '#513324';
}
class CommonCard extends Card{
    primaryColor = '#554396';
}
class RareCard extends Card{
    primaryColor = '#8915a0';
}
class LegendaryCard extends Card{
    primaryColor = '#b66b17';
}
