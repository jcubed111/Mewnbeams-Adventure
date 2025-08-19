class Character extends Sprite{
    // Universal props
    characterName = '?';
    primaryColor = '#f00';
    maxHp;
    currentHp;
    size;  // in rem

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
            styledDiv('C--pic', {
                // backgroundPosition: `${(picIndex % 5) * 25}% ${(~~(picIndex / 5)) * 25}%`,
                // filter: `hue-rotate(${hueShiftDeg}deg)`,
            }),
        ]);
    }

    animateDamage(damage, durationSec = 1) {
        this._preAnimateHp ??= this.currentHp;
        this.currentHp -= damage;
        this.render();
        clearTimeout(this._animateDamageTimeout);
        this._animateDamageTimeout = setTimeout(() => {
            this._preAnimateHp = undefined;
            this.render();
        }, durationSec * 1000);
    }

    render() {
        const hpEl = this.el?.querySelector('.C--hp');
        if(!hpEl) return;

        setChildNumber(hpEl, this.maxHp, () => div());

        for(let i = 0; i < this.maxHp; i++) {
            hpEl.children[i].className = i < this.currentHp
                ? 'C--hpChunk-full'
                : i < this._preAnimateHp ? 'C--hpChunk-pending' : 'C--hpChunk-empty';
        }
    }
}

class BasicRat extends Character{
    characterName = 'Rat';
    maxHp = 4;
    size = 110;
}

class RatWizard extends Character{
    characterName = 'Rat Wizard';
    maxHp = 3;
    size = 110;
}

class RatGuard extends Character{
    characterName = 'Rat Guard';
    maxHp = 8;
    size = 150;
    guard = true;
}
