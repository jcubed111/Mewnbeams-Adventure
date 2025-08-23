// ~11.5%

class Card extends Sprite{
    cardName = '?';
    pic = SpriteSheetPic(0, '#f0a');
    rarityOrder = 0;
    // Universal props
    primaryColor = '#f00';
    actionCost = 0;
    manaCost = 0;

    /* Render Methods */
    asStaticElement(clickable) {
        // ~0.5%
        // returns a view only version of this card for showing
        // in deck/reward selection/etc.
        const clone = new this.constructor();
        clone.el = clone.makeEl();
        clone.render(true);
        clone.el.style.position = 'relative';
        if(clickable) {
            clone.el.classList.add('C--cardForceClickable');
        }else{
            clone.el.style.boxShadow = 'none';
        }
        // cube root here to bias away from rotate(0), which looks boring
        clone.el.style.transform = `rotate(${4 * Math.cbrt(Math.random() - 0.5)}deg)`;
        return clone.el;
    }

    _cardTextDiv;
    makeEl() {
        // ~0.5%
        return styledDiv('C--card', {'background': this.primaryColor}, [
            div('C--actionPointIcon', ['' + this.actionCost]),
            this.manaCost > 0 && div('C--manaPointIcon', ['' + this.manaCost]),
            this.pic(),
            div(
                'C--cardName',
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

    // All set__Positions together are ~1%
    setHandPosition(index, outOf, activated, dx, dy) {
        // card width is 200rem, view is 1000rem wide.
        const rotateNormalized = outOf == 1 ? 0 : -1 + 2 * (index / (outOf - 1));

        const bottomRem = (activated ? 55 : 5) - 20 * rotateNormalized ** 2;
        const leftRem = outOf <= 5
            // gap between cards is 10rem, with 166+5rem on each side at limit
            ? 166 + 505 + 200 * (index - outOf / 2)
            // 5rem on each side
            : 166 + 5 + (800 / (outOf - 1)) * index;

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

    setCantripPosition(numPending) {
        this.el.style.zIndex = 25 + numPending;
        this.el.style.transform = `rotate(0deg)`;
        this.el.style.left = `${556 + 40 * Math.random()}rem`;
        this.el.style.bottom = `${300 + 40 * Math.random()}rem`;
        this.el.classList.add('C--active');
        this.el.classList.remove('C--faceDown');
    }

    // pick a static (but random) discard spot so we don't change it
    // every render.
    _discardSpot = [
        Math.random() * 150 - 75 + 1433,
        Math.random() * 150 - 75 - 100,
    ];
    setDiscardPosition() {
        const [dx, dy] = this._discardSpot;
        this.el.style.zIndex = 25;
        this.el.style.transform = `rotate(0deg)`;
        this.el.style.left = `${dx}rem`;
        this.el.style.bottom = `${dy}rem`;
        this.el.classList.remove('C--active');
        this.el.classList.remove('C--faceDown');
    }

    setExhaustedPosition() {
        this.fadeOut();
    }

    /* Game Methods */
    isTargeted() {
        // Whether this card targets a specific enemy
        return !this.targetMode && (
            this.damage != undefined
            || this.splashDamage != undefined
            || this.stun != undefined
            || this.bleed != undefined
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

    // shows before the rest of the card text. To replace all card text,
    // override the getTextLines method.
    extraCardText;

    // NON-PLAY/META EFFECTS
    // makes the card hit all enemies
    // supports TARGET_TO_ALL, AT_LEFT_ENEMY to hit the left enemy
    targetMode = 0;
    // plays on draw
    cantrip;
    // exhaust after playing
    exhaust;
    // ends the player's turn after playing
    // also supports CAUSES_PASS_RETAIN_VALUE which does the same thing but you don't discard you hand
    causesPass;
    // play multiple times
    repeatPlay = 1;

    // ENEMY EFFECTS
    // damage?: number
    damage;
    // splashDamage?: number
    splashDamage;
    // bleed?: number - damage per turn, decay 1 per turn
    bleed;
    // fear?: number - reduces next attack by X, decay all
    // fear;
    // stun?: 0 | 1 - cancels the enemy's action this turn
    stun;

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
    // dodge?: number - dodge the next {n} attack(s)
    dodge;

    getTextLines(standalone) {
        // ~2%
        const targetModeText = ['', ' to all', ' to the left enemy'][this.targetMode];
        return [
            this.extraCardText,

            this.cantrip &&
                `Cantrip`,

            this.damage != undefined &&
                `Attack ${
                    this.damage
                    + (standalone ? 0 : player.strength)
                }${targetModeText}`,

            this.splashDamage != undefined &&
                `Splash Attack ${
                    this.splashDamage
                    + (standalone ? 0 : player.strength)
                }${targetModeText}`,

            this.bleed != undefined &&
                `Bleed ${this.bleed}${targetModeText}`,

            // this.fear != undefined &&
            //     `Scare ${this.fear}${targetModeText}`,

            this.stun &&
                `Stun${targetModeText}`,


            this.gainActions != undefined &&
                `Gain ${this.gainActions} Actions`,

            this.gainMana != undefined &&
                `Gain ${this.gainMana} Mana`,

            this.selfHeal != undefined &&
                `Heal ${this.selfHeal}`,

            this.selfDamage != undefined &&
                `Damage Self ${this.selfDamage}`,

            this.gainStrength != undefined &&
                `Attacks do +${this.gainStrength} damage this fight`,

            this.draw != undefined &&
                `Draw ${this.draw}`,

            this.dodge &&
                `Dodge ${this.dodge} this turn`,

            // End of play effects
            this.repeatPlay != 1 &&
                `${this.repeatPlay} Times`,

            this.causesPass &&
                `Pass`,

            this.causesPass == CAUSES_PASS_RETAIN_VALUE &&
                `Retain Your Hand`,

            this.exhaust &&
                `Exhaust`,
        ].filter(l => l);
    }

    async play(targets) {
        // ~1.2%
        if(this.targetMode === AT_LEFT_ENEMY) {
            targets = targets.slice(0, 1);
        }
        for(const i of range(this.repeatPlay)) {
            // add a wait to make the repeat more obvious
            if(i > 0) await wait(0.2);

            targets.forEach(target => {
                if(this.damage != undefined) {
                    target.animateDamage(this.damage + player.strength);
                }
                if(this.splashDamage != undefined) {
                    enemyManager.activeEnemies
                        .forEach((adjacent, i, arr) => {
                            if(
                                arr[i - 1] == target
                                || arr[i + 1] == target
                            ) {
                                adjacent.animateDamage(this.splashDamage + player.strength)
                            }
                        });
                }
                if(this.bleed != undefined) {
                    target.gainBleed(this.bleed);
                }
                // TODO: fear
                if(this.stun != undefined) {
                    target.clearAction();
                }
            });

            if(this.gainActions != undefined) {
                player.pay(-this.gainActions, 0);
            }
            if(this.gainMana != undefined) {
                player.pay(0, -this.gainMana);
            }
            if(this.selfHeal) {
                player.heal(this.selfHeal);
            }
            if(this.selfDamage) {
                player.animateDamage(this.selfDamage);
            }
            if(this.gainStrength) {
                player.strength += this.gainStrength;
                player.render();
                cardManager.render();
            }
            if(this.draw) {
                await cardManager.draw(this.draw);
            }
            if(this.dodge) {
                player.dodge += this.dodge;
                player.render();
            }
        }
    }
}

class CommonCard extends Card{
    rarityOrder = 0;
    primaryColor = '#554396';
}
class RareCard extends Card{
    rarityOrder = 1;
    primaryColor = '#8915a0';
}
class LegendaryCard extends Card{
    rarityOrder = 2;
    primaryColor = '#b66b17';
}
class TrinketCard extends Card{
    rarityOrder = 3;
    primaryColor = '#923303';
}
class ItemCard extends Card{
    rarityOrder = 4;
    primaryColor = 'linear-gradient(90deg, #b66b17, #923303, #8915a0)';
}
class CurseCard extends Card{
    rarityOrder = 6;
    primaryColor = '#289876';
}
