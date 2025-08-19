const enemyManager = new EnemyManager();
const cardManager = new CardManager([
    new cardLibrary.Claw(),
    new cardLibrary.Claw(),
    new cardLibrary.Swipe(),
    new cardLibrary.Swipe(),
    new cardLibrary.Swipe(),
    new cardLibrary.SeeGhost(),
    new cardLibrary.Channel(),
]);
const player = new class extends Character{
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


async function main() {
    // const card = new cardLibrary.ConveneWithSpirits();
    // card.showAndRender();

    // await enemyManager.animateIn([
    // ]);
    // await enemyManager.animateIn([
    // ], 1);
    // const monster = new BasicRat();
    // monster.showAndRender();
    // monster.el.addEventListener('click', () => monster.animateDamage(1));

    // keep this here so it doesn't get optimized out
    zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]); // Game Over

    console.log([...Object.values(cardLibrary)]);

    player.showAndRender();

    await runBattle([
        new BasicRat(),
        new RatGuard(),
        new RatWizard(),
    ]);
}
window.addEventListener('load', main);


async function runBattle(enemies) {
    enemyManager.clear();
    cardManager.resetForRound();
    await wait(0.1);

    const HAND_SIZE = 5;

    await Promise.all([
        enemyManager.animateIn(enemies),
        cardManager.draw(HAND_SIZE),
    ]);

    battleTurnLoop: while(true) {
        // player turn
        while(true) {
            const result = await getMove();
            if(result == "pass") {
                console.log("pass");
                break;
            }else{
                let [card, target] = result;

                player.pay(card.actionCost, card.manaCost);

                card.play(target ? [target] : enemyManager.activeEnemies);

                await wait(0.2);

                enemyManager.removeDead();
                if(enemyManager.activeEnemies.length == 0) {
                    break battleTurnLoop;
                }

                if(card.exhaust) {
                    cardManager.exhaustPending();
                }else{
                    cardManager.discardPending();
                }
            }
        }

        await cardManager.discardHand();

        player.manaPoints += 1;
        player.actionPoints = 3;
        player.render();

        await cardManager.draw(HAND_SIZE);
    }

    // cleanup
    await cardManager.discardHand();
}

async function getMove() {
    // returns:
    //     "pass"
    //     | [Card, null]
    //     | [Card, Monster]
    const [activeCard, activateEvent] = await cardManager.getCardActivateOrPass();
    if(activeCard == "pass") return "pass";

    cardManager.render();

    let cleanUp = () => {};

    const result = await new Promise(resolve => {
        function onEnd(e) {
            if(activeCard.isTargeted()) {
                for(const [el, monster] of enemyManager.getElMap()) {
                    if(el.contains(e.target)) {
                        return resolve([activeCard, monster]);
                    }
                }
            }else if(inAoeBounds(e)) {
                // treat the entire area above the hand as targetable
                return resolve([activeCard, null]);
            }
            resolve(null);
        }

        async function onMouseUp(e) {
            const [dx, dy] = getTravelDelta(activateEvent, e);
            if(dx ** 2 + dy ** 2 < 100) {
                // treat this as a click event to start activation, then listen
                // for a future click event to end.
                await wait(0.05);
                window.addEventListener('click', onEnd);
            }else{
                onEnd(e);
            }
        }

        function onKeyDown(e) {
            if(e.key === "Escape") {
                resolve(null);
            }
        }

        function onMouseMove(e) {
            const [dx, dy] = getTravelDelta(activateEvent, e);
            const {top, left} = document.body.getBoundingClientRect();
            cardManager.activationPosition = [e.clientX - left, e.clientY - top, dx, dy];
            cardManager.render();
        }

        if(activeCard.isTargeted()) {
            document.body.classList.add('C--gettingMonsterTarget');
        }
        window.addEventListener('mouseup', onMouseUp, {'once': true});
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        cleanUp = () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('click', onEnd);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('keydown', onKeyDown);
            document.body.classList.remove('C--gettingMonsterTarget');
        };
    });

    if(result) cardManager.setPending(activeCard);
    cardManager.deactivate();
    cleanUp();

    // if cancelled, try again.
    if(result == null) {
        return getMove();
    }else{
        return result;
    }
}

function inAoeBounds(e) {
    const {top, left, right, height} = document.body.getBoundingClientRect();
    return e.clientX >= left
        && e.clientX <= right
        && e.clientY >= top
        && e.clientY <= top + 0.7 * height;
}

function getTravelDelta(a, b) {
    return [
        b.clientX - a.clientX,
        b.clientY - a.clientY,
    ];
}
