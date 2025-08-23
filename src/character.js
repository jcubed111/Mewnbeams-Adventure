class Character extends Sprite{
    // Universal props
    characterName = '?';
    maxHp;
    size;  // in rem
    pic = SpriteSheetPic(0, '#587');

    /* Attributes */
    // guard - this enemy must be targeted first
    guard = false;

    /* State, don't override */
    currentHp;
    block = 0;
    bleed = 0;
    dodge = 0;  // dodge an attack

    /* Methods */
    hpBarEl;
    blockBarEl;
    pendingActionEl;
    makeEl() {
        // ~1%
        this.currentHp ??= this.maxHp;

        this.specialBarEl = div(`C--pipBar ${this.size >= 200 && 'C--wide'}`);
        this.blockBarEl = div(`C--pipBar ${this.size >= 200 && 'C--wide'}`);
        this.hpBarEl = div(`C--pipBar ${this.size >= 200 && 'C--wide'}`);
        this.pendingActionEl = div('C--pendingAction');

        // const [picIndex, hueShiftDeg] = this.pic;
        return styledDiv('C--character', {width: `${this.size}rem`},
            this.specialBarEl,
            this.blockBarEl,
            this.hpBarEl,
            this.pic(),
            div('', this.characterName),
            this.pendingActionEl,
        );
    }

    // hook called after you take unblocked damange
    afterUnblockedDamage(){}

    animateDamage(damage) {
        // ~1%
        if(this.dodge) {
            this.dodge--;
            this.render();
            return;
        }

        this._preAnimateHp ??= this.currentHp;

        const blocked = damage > 0 ? Math.min(this.block, damage) : 0;
        this.block -= blocked;
        const netDamage = (damage - blocked);
        this.currentHp -= damage - blocked;

        if(netDamage && this.currentHp > 0) {
            this.afterUnblockedDamage();
        }

        this.render();
        clearTimeout(this._animateDamageTimeout);
        this._animateDamageTimeout = setTimeout(() => {
            this._preAnimateHp = undefined;
            this.render();
        }, 1000);
    }

    heal(hp) {
        this.currentHp += hp;
        this._preAnimateHp = undefined;
        this.render();
    }

    gainBleed(bleed) {
        this.bleed += bleed;
        this.render();
    }

    gainBlock(block) {
        this.block += block;
        this.render();
    }

    async onStartOfTurn() {
        this.block = 0;
        this.dodge = 0;
        this.render();
        if(this.bleed > 0) {
            this.animateDamage(this.bleed--);
            // Disallow bleed triggering dodge gain on weasel
            this.dodge = 0;
            this.render();

            await wait(0.3);
        }
    }

    async animateAttack(yDirection=1, xDirection) {
        const el = this.el;
        if(!el) return;
        el.style.marginBottom = `${-20 * yDirection}rem`;
        el.style.marginLeft = `${20 * xDirection}rem`;
        await wait(0.15);
        el.style.marginBottom = '';
        el.style.marginLeft = '';
        await wait(0.15);
    }

    render() {
        if(!this.el) return;

        this.pendingActionEl.innerText = this.peekAction()[0];

        setChildNumber(this.hpBarEl, this.maxHp, () => div());
        for(let i = 0; i < this.maxHp; i++) {
            this.hpBarEl.children[i].className =
                i < this.currentHp - this.bleed
                    ? 'C--hpChunk-full'
                    : i < this.currentHp
                        ? 'C--hpChunk-bleed'
                        : i < this._preAnimateHp
                            ? 'C--hpChunk-pending'
                            : 'C--hpChunk-empty';
        }

        setChildNumber(this.blockBarEl, this.block, () => div('C--blockChunk'));

        setChildren(this.specialBarEl,
            range(this.dodge).map(_ => div('C--dodgeChunk')),
        );
    }

    /* enemy action sequences */

    *getActionSequence() {
        // can last forever, or can be a finite list that will
        // be repeated by getActionsForever
        yield actions.Pass;
    }

    *getActionsForever() {
        // loops this.getActionSequence
        while(true) {
            yield* this.getActionSequence();
        }
    }

    _actionGenerator;
    _pendingAction;
    peekAction() {
        this._actionGenerator ??= this.getActionsForever();
        this._pendingAction ??= this._actionGenerator.next().value;
        return this._pendingAction;
    }

    // replaces action with a blank instead of `null` so that
    // we can show no action till the next round starts.
    // This is also used by the stun effect
    clearAction() {
        this._pendingAction = actions.None;
        this.render();
    }

    // runs after round ends to get set up for next round
    resetAction() {
        this._pendingAction = undefined;
        this.render();
    }
}
