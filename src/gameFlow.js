async function runMainMenu() {
    // placeholder - remove
    // await cardListViewScreen([...Object.values(cardLibrary)].map(C => new C));
    await runBattle([
        new monsterLibrary.BasicRat(),
        new monsterLibrary.RatGuard(),
        new monsterLibrary.RatWizard(),
    ]);
    //////////////

    const selction = await showChoiceMenu(0,
        plainElement('h1', ['Mewnbeam’s Quest']),
        'Start',
    );
    // the only choice is play lol
    await runGameRun();

    return await runMainMenu();
}

async function runGameRun() {
    const choice = await showChoiceMenu(1,
        fadeInText`Mewnbeam, would you be a dear and ${plainElement('i', [`take care of`])} that ${plainElement('b', [`Rat King`])} while I’m out?${br()}${br()}He should be easy to find, he’s been causing lots of trouble up in the attic.`,
        'Mrow?',
        'Hiiisssss!',
    );
    if(choice == 0) {
        await showChoiceMenu(1,
            fadeInText`Shouldn’t be a big deal, just run through the castle defeating his minions, then ${plainElement('b', [`take him down!`])}`,
            'Hiiisssss?'
        );
    }
    const choices = [
        new cardLibrary.Swipe(),
        new cardLibrary.ConveneWithSpirits(),
        new cardLibrary.Meow(),
    ];
    const flavorTextStore = shuffleInPlace([
        'potion shop',
        'apothecary',
        'grave yard',
        'broom emporium',
    ])[0];
    const boonChoice = await showChoiceMenu(2,
        fadeInText`Hmph. Alright.${br()}${br()}I do need to be off to the ${flavorTextStore}, but I suppose I could give you some help before I go.${br()}${br()}What’ll it be?`,
        ...choices.map(c => c.asStaticElement()),
    );
    cardManager.addToDeck(choices[boonChoice]);

    await runBattle([
        new monsterLibrary.BasicRat(),
        new monsterLibrary.RatGuard(),
        new monsterLibrary.RatWizard(),
    ]);

    // TODO: end the run
    await deathScreen();
    await victoryScreen();
}


async function runBattle(enemies) {
    enemyManager.clear();
    cardManager.resetForRound();

    player.manaPoints = INITIAL_MANA;
    player.actionPoints = ACTIONS_PER_ROUND;
    player.strength = 0;
    player.render();

    await wait(0.1);

    await Promise.all([
        enemyManager.animateIn(enemies),
        cardManager.draw(TURN_START_HAND_SIZE),
    ]);

    await runBattleMain();

    // cleanup
    await cardManager.discardHand();
}

async function runBattleMain() {
    while(true) {
        /* player turn */
        while(true) {
            // update enemy actions
            enemyManager.render();

            const result = await getMove();
            if(result == "pass") {
                console.log("pass");
                break;
            }else{
                let [card, target] = result;

                player.pay(card.actionCost, card.manaCost);

                // if the card is instant, wait at least 0.2 secs
                await Promise.all([
                    card.play(target ? [target] : enemyManager.activeEnemies),
                    wait(0.2),
                ]);

                enemyManager.removeDead();
                if(enemyManager.activeEnemies.length == 0) {
                    return;
                }

                if(card.exhaust) {
                    cardManager.exhaustPending();
                }else{
                    cardManager.discardPending();
                }
            }
        }

        await cardManager.discardHand();

        /* monster turn */
        for(const e of enemyManager.activeEnemies) {
            await e.onStartOfTurn();

            enemyManager.removeDead();
            if(enemyManager.activeEnemies.length == 0) {
                return;
            }
        }

        const startOfRoundEnemies = [...enemyManager.activeEnemies];
        for(const enemy of startOfRoundEnemies) {
            // It's possible this got killed by a fellow enemy before
            // moving. If so, skip.
            if(enemy.currentHp <= 0) continue;
            enemy.peekAction().run(enemy);
            enemyManager.removeDead();
            await wait(0.1);
            enemy.clearAction();
            await wait(0.5);
        }

        if(enemyManager.activeEnemies.length == 0) {
            return;
        }

        /* reset */
        player.manaPoints += MANA_PER_ROUND;
        player.actionPoints = ACTIONS_PER_ROUND;
        player.render();

        enemyManager.activeEnemies.forEach(enemy => enemy.resetAction());

        await cardManager.draw(TURN_START_HAND_SIZE);
    }
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
