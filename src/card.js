function CardPic(index, hueShiftDeg) {
    return [index, hueShiftDeg];
}


class Card extends Sprite{
    pic = CardPic(0, 0);
    // Universal props
    cardName = '?';
    primaryColor = '#f00';
    actionCost = 1;
    manaCost = 0;

    /* Card effect props, roughly in display order */
    // Numbers use `undefined` so that the value `0` is
    // available, ie `Attack 0` is a valid card.

    // TARGETING
    // makes the card hit all enemies
    toAll = false;

    // ENEMY EFFECTS
    // damage?: number
    damage;
    // bleed?: number - damage per turn, decay 1 per turn
    bleed;
    // fear?: number - reduces next attack by X, decay all
    fear;

    // SELF EFFECTS
    // gainMana?: number - gain mana
    gainMana;
    // selfHeal ?: number - heal for this amount
    selfHeal;
    // draw?: number - draw more cards
    draw;

    // exhaust after playing
    exhaust = false;

    /* Render Methods */
    makeEl() {
        const [picIndex, hueShiftDeg] = this.pic;
        return styledDiv('card', {'--color': this.primaryColor}, [
            div('costA', ['' + this.actionCost]),
            this.manaCost > 0 && div('costM', ['' + this.manaCost]),
            styledDiv('pic', {
                backgroundPosition: `${(picIndex % 5) * 25}% ${(~~(picIndex / 5)) * 25}%`,
                filter: `hue-rotate(${hueShiftDeg}deg)`,
            }),
            div('name', [this.cardName]),
            div(
                'text',
                this.getTextLines()
                    .map(d => div('line', [d]))
            ),
        ]);
    }

    render() {
        this.el.classList.toggle('unplayable', !this.playable());
    }

    getTextLines() {
        const toAllText = this.toAll ? ' to All' : '';
        return [
            this.damage != undefined && `Attack ${this.damage}${toAllText}`,
            this.bleed != undefined && `Bleed ${this.bleed}${toAllText}`,
            this.fear != undefined && `Scare ${this.fear}${toAllText}`,

            this.gainMana != undefined && `Gain ${this.gainMana} Mana`,
            this.selfHeal != undefined && `Heal ${this.selfHeal}`,
            this.draw != undefined && `Draw ${this.draw}`,

            this.exhaust && `Exhaust`,
        ].filter(l => l);
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

        this.el.classList.toggle('act', activated);
    }

    setDrawPosition() {
        this.el.style.transform = `rotate(0deg)`;
        this.el.style.zIndex = 25;
        this.el.style.left = '-250rem';
        this.el.style.bottom = '-100rem';
        this.el.classList.toggle('act', false);
    }

    setDiscardPosition() {
        this.el.style.transform = `rotate(0deg)`;
        this.el.style.zIndex = 25;
        this.el.style.left = '1050rem';
        this.el.style.bottom = '-100rem';
        this.el.classList.toggle('act', false);
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

    play(targets) {
        if(this.damage != undefined) {
            targets.forEach(t => t.animateDamage(this.damage));
        }
        if(this.gainMana != undefined) {
            player.pay(0, -this.gainMana);
        }
        // TODO: other effects
    }
}
