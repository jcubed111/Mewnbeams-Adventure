class Character extends Sprite{
    // Universal props
    characterName = '?';
    primaryColor = '#f00';
    maxHp;
    currentHp;
    size;  // in rem
    block = 0;

    /* Attributes */
    // guard - this enemy must be targeted first
    guard = false;

    // Methods
    makeEl() {
        this.currentHp ??= this.maxHp;

        // const [picIndex, hueShiftDeg] = this.pic;
        return styledDiv('C--character', {'--color': this.primaryColor, width: `${this.size}rem`,}, [
            div('C--name', [this.characterName]),
            div(`C--hp ${this.size >= 200 && 'C--wide'}`),  // gets filled by render
            div(`C--block ${this.size >= 200 && 'C--wide'}`),  // gets filled by render
            styledDiv('C--pic', {
                // backgroundPosition: `${(picIndex % 5) * 25}% ${(~~(picIndex / 5)) * 25}%`,
                // filter: `hue-rotate(${hueShiftDeg}deg)`,
            }),
            div('C--pendingAction'),  // filled in render
        ]);
    }

    animateDamage(damage, durationSec = 1) {
        this._preAnimateHp ??= this.currentHp;
        const blocked = damage > 0 ? Math.min(this.block, damage) : 0;
        this.block -= blocked;
        this.currentHp -= damage - blocked;
        this.render();
        clearTimeout(this._animateDamageTimeout);
        this._animateDamageTimeout = setTimeout(() => {
            this._preAnimateHp = undefined;
            this.render();
        }, durationSec * 1000);
    }

    gainBlock(block) {
        this.block += block;
        this.render();
    }

    resetBlock(block) {
        this.block = 0;
        this.render();
    }

    async animateAttack(direction=1) {
        const el = this.el;
        if(!el) return;
        el.style.marginBottom = `${-20 * direction}rem`;
        await wait(0.15);
        el.style.marginBottom = '';
        await wait(0.15);
    }

    render() {
        const pendingActionEl = this.el?.querySelector('.C--pendingAction');
        if(pendingActionEl) {
            pendingActionEl.innerText = this.peekAction().stringify();
        }

        const hpEl = this.el?.querySelector('.C--hp');
        if(hpEl) {
            setChildNumber(hpEl, this.maxHp, () => div());

            for(let i = 0; i < this.maxHp; i++) {
                hpEl.children[i].className = i < this.currentHp
                    ? 'C--hpChunk-full'
                    : i < this._preAnimateHp ? 'C--hpChunk-pending' : 'C--hpChunk-empty';
            }
        }

        const blockEl = this.el?.querySelector('.C--block');
        if(blockEl) {
            setChildNumber(blockEl, this.block, () => div('C--blockChunk'));
        }
    }

    /* monster action sequences */

    *getActionSequence() {
        // can last forever, or can be a finite list that will
        // be repeated by getActionsForever
        yield new actions.Pass;
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
    clearAction() {
        this._pendingAction = new actions.None;
        this.render();
    }

    // runs after round ends to get set up for next round
    resetAction() {
        this._pendingAction = undefined;
        this.render();
    }
}

class BasicRat extends Character{
    characterName = 'Rat';
    maxHp = 4;
    size = 110;

    *getActionSequence() {
        yield* shuffleInPlace([
            new actions.Block(2),
            new actions.Attack(1),
            new actions.Attack(2),
        ]);
    }
}

class RatWizard extends Character{
    characterName = 'Rat Wizard';
    maxHp = 3;
    size = 110;

    *getActionSequence() {
        yield new actions.Pass;
        yield new actions.Attack(4);
    }
}

class RatGuard extends Character{
    characterName = 'Rat Guard';
    maxHp = 8;
    size = 150;
    guard = true;

    *getActionSequence() {
        yield* shuffleInPlace([
            new actions.Attack(2),
            new actions.Block(3),
            new actions.Block(5),
        ]);
    }
}
