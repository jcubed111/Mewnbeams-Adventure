class CardManager{
    deck = [];
    drawPile = [];
    hand = [];
    pending = [];
    discardPile = [];
    exhaustPile = [];

    reset() {
        this.deck = [
            new CARD_CLAW,
            new CARD_CLAW,
            new CARD_CLAW,
            new CARD_SCRATCH,
            new CARD_SWIPE,
            new CARD_STOMP,
        ];
        this.render();
    }

    targetArrow = new class extends Sprite{
        // ~1.5%
        makeEl() {
            return styled('canvas', 'C--arrowCanvas');
        }

        render(startEl, endX, endY) {
            if(!startEl) return;
            const {width, height, left, top} = document.body.getBoundingClientRect();
            this.el.width = width;
            this.el.height = height;
            const bounds = startEl.getBoundingClientRect();
            const startX = bounds.left - left + bounds.width / 2;
            const startY = bounds.top - top + bounds.height / 2;

            const ctx = this.el.getContext('2d');
            ctx.clearRect(0, 0, 1e6, 1e6);
            ctx.lineCap = 'round';
            ctx.setLineDash([30]);
            ctx.beginPath();
            ctx.moveTo(endX, endY);
            ctx.lineTo(startX, startY - 0.05 * height);

            ctx.strokeStyle = '#ddd';
            ctx.lineWidth = 28;
            ctx.stroke();

            ctx.strokeStyle = '#a0f';
            ctx.lineWidth = 20;
            ctx.stroke();
        }
    };

    passButton = new class extends Sprite{
        makeEl() {
            return div('C--passButton C--disabled C--buttonLike', "End Turn");
        }
    }

    deckButton = new CardPile(
        'Deck',
        '20rem auto auto 20rem',
        e => cardListViewScreen(this.deck),
    );

    drawButton = new CardPile(
        'Draw',
        'auto auto 20rem 20rem',
        e => cardListViewScreen(this.drawPile, true),
    );

    discardButton = new CardPile(
        'Discard',
        'auto 20rem 20rem auto',
        e => cardListViewScreen(this.discardPile),
    );

    // Tracks activating a card to play it
    active = null;
    activationPosition = [];  // [x, y, dx, dy]
    // the x,y is used for an absolute screen
    // position, whereas dx,dy is ued when dragging
    // a card.

    addToDeck(...cards) {
        this.deck.push(...cards);
        this.render();
    }

    removeDeckIndex(i) {
        this.deck.splice(i, 1);
        this.render();
    }

    render() {
        // ~5%
        this.passButton.showAndRender();

        this.drawButton.showAndRender(this.drawPile.length);
        this.discardButton.showAndRender(this.discardPile.length);
        this.deckButton.showAndRender(this.deck.length);
        // force the deck button to show in card raward view as well
        this.deckButton.el.style.zIndex = 60;

        const [ax, ay, activeDx, activeDy] = this.activationPosition;

        this.drawPile.forEach(card => {
            card.showAndRender();
            card.setDrawPosition();
        });
        this.pending.forEach(card => {
            card.showAndRender();
        });
        this.hand.forEach((card, i) => {
            card.showAndRender();
            const isActive = card === this.active;
            card.setHandPosition(
                i,
                this.hand.length,
                isActive,
                ...(isActive && !card.isTargeted() ? [activeDx || 0, activeDy || 0] : [0, 0]),
            );
        });
        this.discardPile.forEach(card => {
            card.showAndRender();
            card.setDiscardPosition();
        });
        this.exhaustPile.forEach(card => {
            card.showAndRender();
            card.setExhaustedPosition();
        });

        // render activation
        if(this.active?.isTargeted()) {
            this.targetArrow.showAndRender(this.active?.el, ax, ay);
        }else{
            this.targetArrow.hide();
        }
    }

    cardsInPlay() {
        return this.drawPile.concat(
            this.pending,
            this.hand,
            this.discardPile,
        );
    }

    canDraw() {
        return this.drawPile.length > 0 || this.discardPile.length > 0;
    }

    resetForRound() {
        // hide all first to make sure we hide any non-deck cards stuck in
        // hand/exhaust/etc.
        this.hideAll();
        // reset our piles to just the deck
        this.drawPile = shuffleInPlace([...this.deck]);
        this.hand = [];
        this.pending = [];
        this.discardPile = [];
        this.exhaustPile = [];
        // render, but don't yet deal.
        this.render();
    }

    hideAll() {
        // remove all cards from view
        [
            ...this.deck,
            ...this.drawPile,
            ...this.hand,
            ...this.pending,
            ...this.discardPile,
            ...this.exhaustPile,
        ].forEach(c => c.hide());
    }

    async drawOne() {
        if(this.drawPile.length == 0) {
            if(this.discardPile.length == 0) return;  // can't draw
            this.reshuffle();
            this.render();
            await wait(0.4);
        }
        // If your hand is full, your draws go to the discard pile
        const card = this.drawPile.pop();
        const dest =
            card.cantrip
            ? this.pending
            : this.hand.length < MAX_HAND_SIZE
                ? this.hand
                : this.discardPile;
        dest.unshift(card);

        this.render();

        if(card.cantrip) {
            card.setCantripPosition(this.pending.length);
            await wait(0.4);
            await card.play(enemyManager.activeEnemies);
        }

        await wait(0.4);
    }

    async draw(num) {
        for(let i = 0; i < num; i++) {
            if(!this.canDraw()) return;
            await this.drawOne();
        }
    }

    reshuffle() {
        this.drawPile = [...this.drawPile, ...this.discardPile];
        this.discardPile = [];
        shuffleInPlace(this.drawPile);
    }

    async getCardActivateOrPass() {
        // ~1%
        // Adds listeners to wait for a card activate event
        // returns the card the gets activated and the event,
        // then removes listeners.
        const removers = [];
        document.body.classList.add('C--gettingCard');
        this.render();
        const [card, activateEvent] = await new Promise(resolve => {
            for(const card of this.hand) {
                if(!card.playable()) continue;
                const cb = e => resolve([card, e]);
                card.el.addEventListener('mousedown', cb);
                removers.push(() => card.el.removeEventListener('mousedown', cb));
            }

            const pass = e => resolve(["pass", e]);
            this.passButton.el.classList.remove('C--disabled');
            this.passButton.el.addEventListener('click', pass);
            removers.push(() => {
                this.passButton.el.classList.add('C--disabled');
                this.passButton.el.removeEventListener('click', pass);
            });
        });
        document.body.classList.remove('C--gettingCard');
        removers.forEach(r => r());

        if(card != "pass") {
            this.active = card;
        }
        this.render();
        return [card, activateEvent];
    }

    setPending(card) {
        this.pending.push(card);
        this.hand = this.hand.filter(c => c != card);
        this.render();
    }

    async discardHand() {
        this.discardPile.push(...this.hand);
        this.hand = [];
        this.render();
        await wait(0.4);
    }

    resolvePending() {
        this.discardPile.push(...this.pending.filter(c => !c.exhaust));
        this.exhaustPile.push(...this.pending.filter(c => c.exhaust));
        this.pending = [];
        this.render();
    }

    deactivate() {
        this.activationPosition = [];
        this.active = null;
        this.render();
    }

    // target is one of:
    //   ANIMATE_INTO_TARGET_DRAW = 0
    //   ANIMATE_INTO_TARGET_HAND = 1
    //   ANIMATE_INTO_TARGET_DISCARD = 2
    async animateInto(target, card) {
        card.showAndRender();
        card.setCantripPosition(-1);
        await wait(0.2);
        [
            this.drawPile,
            this.hand,
            this.discardPile,
        ][target].push(card);
        shuffleInPlace(this.drawPile);
        this.render();
        await wait(0.2);
    }
}

class CardPile extends Sprite{
    constructor(pileName, insetCss, onClick) {
        super();
        this.insetCss = insetCss;
        this.onClick = onClick;
        this.pileName = pileName;
    }

    _numberEl;
    makeEl() {
        const d = styledDiv('C--cardPile', {'inset': this.insetCss},
            this._numberEl = div(),
             div('C--cardPileName', this.pileName),
        );
        d.addEventListener('click', this.onClick);
        return d;
    }

    render(numCards) {
        this._numberEl.innerText = numCards;
        this.el?.classList.toggle('C--cardPileEmpty', numCards == 0);
    }
}
