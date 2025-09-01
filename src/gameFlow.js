const enemyManager = new EnemyManager();
const cardManager = new CardManager();
let player = new Player(), minimap;
const resetGameState = () => {
    player?.hide();
    minimap?.hide();
    enemyManager.clear();

    player = new Player();
    minimap = new Minimap();
};


async function runMainMenu() {
    resetGameState();
    // placeholder - remove
    // for(const e of eventLibrary) {
    //     await e();
    // }
    // await runNap();
    // await deathScreen();
    // await victoryScreen();
    // await cardListViewScreen(cardLibrary.map(C => new C), 0, CardListWithBackButton, 'Title');
    //////////////
    // resetGameState();
    // player.showAndRender();
    // await runBattle([
    //     new enemyLibrary.Beaver(),
    //     new enemyLibrary.Weasel(),
    //     new enemyLibrary.PoisonRat(),
    // ]);
    //////////////

    const selection = await showChoiceMenu(ChoiceMenuDefault,
        [
            plainElement('h1', 'Mewnbeam’s Adventure'),
            SpriteSheetPic(39, '#000')(),
        ],
        0,
        'Start',
        'Library',
    );
    if(selection == 0) {
        await runGameRun();
    }else{
        await cardListViewScreen(
            cardLibrary.map(C => new C),
            true,
            CardListWithBackButton,
            'Library',
            true,
        );
    }

    return await runMainMenu();
}

async function runGameRun() {
    resetGameState();
    minimap.showAndRender();
    player.showAndRender();
    cardManager.reset();
    const shuffledEvents = shuffleInPlace([...eventLibrary]);

    /* OPENING */
    const choice = await showChoiceMenu(ChoiceMenuDefault,
        fadeInText`Mewnbeam, would you be a dear and ${plainElement('i', `take care of`)} that ${plainElement('b', `Rat King`)} while I’m out?${br()}${br()}He should be easy to find, he’s been causing lots of trouble up in the attic.`,
        witchPic(),
        'Mrow?',
        'Hiiisssss!',
    );
    if(choice == 0) {
        await showChoiceMenu(ChoiceMenuDefault,
            fadeInText`Shouldn’t be a big deal, just remember: ${plainElement('i', `Mana`)} carries over, but ${plainElement('b', `actions`)} reset every round.`,
            witchPic(),
            'Hiiisssss?'
        );
    }
    const boonChoice = await cardRewardScreen(
        fadeInText`Hmph. Alright, I do need to be off to the potion shop, but I suppose I could give you some help before I go.${br()}${br()}What’ll it be?`,
        ' ',
        getThreeRandomTrinkets(),
    );

    /* Floors */
    const fightGenerator = getFightGenerator();
    for(let floorIndex = 0; floorIndex < NUM_FLOORS; floorIndex++) {
        /* Direction Choice */

        const chosenFloorType = await minimap.getNextFloor();

        await bodyBg.slideNext();

        if(chosenFloorType == RoomType.Nap) {
            await runNap();

        }else if(chosenFloorType == RoomType.Event) {
            await shuffledEvents.pop()();
            // Note: we don't check for death here because none
            // of the events can kill you.

        }else{  // Fight or Boss
            const [enemies, cardRewards] = fightGenerator(floorIndex);
            await runBattle(enemies);

            /* Death :'( */
            if(player.currentHp <= 0) {
                await deathScreen();
                return;
            }

            /* Card Reward */
            if(floorIndex < NUM_FLOORS - 1) {
                const cardChoice = await cardRewardScreen(
                    plainElement('h2', `Choose...`),
                    0,
                    cardRewards,
                );
            }
        }
    }

    /* Victory! :D */
    await victoryScreen();
}


async function runNap() {
    const napChoice = await showChoiceMenu(ChoiceMenuDefault,
        [
            styledDiv('', {height: '60rem'}),
            SpriteSheetPic(39, '#000')(),
            styledDiv('', {height: '60rem'}),
            `This looks like a cozy spot...`,
        ],
        0,
        `Cat Nap (Heal ${NAP_HEAL_AMOUNT}: ${player.currentHp} → ${Math.min(player.maxHp, player.currentHp + NAP_HEAL_AMOUNT)})`,
        'Lick (Remove a Card)',
    );

    if(napChoice == 0) {
        player.heal(NAP_HEAL_AMOUNT);

    }else{
        const removeIndex = await cardListViewScreen(
            cardManager.deck,
            false,
            CardListWithCardSelectAndBack,
            'Remove a Card...',
        );
        // If we clicked back, just run the nap again
        if(removeIndex == -1) return await runNap();
        cardManager.removeDeckIndex(removeIndex);
    }
}

async function runBattle(enemies) {
    enemyManager.clear();
    cardManager.resetForRound();

    player.reset();

    await wait(0.1);

    await enemyManager.animateIn(enemies);

    await runBattleMain();

    // cleanup
    if(player.currentHp > 0) {
        player.reset();
    }
    await cardManager.discardHand();
}

async function runBattleMain() {
    let retainOneTurn = false;
    while(true) {
        await cardManager.draw(TURN_START_HAND_SIZE);
        // we may have drawn cantrips
        cardManager.resolvePending();
        enemyManager.removeDead();
        if(enemyManager.activeEnemies.length == 0) {
            return;
        }

        /* player turn */
        while(true) {
            // update enemy actions
            enemyManager.render();

            const result = await getMove();
            if(result == "pass") {
                break;
            }else{
                let [card, target] = result;

                player.pay(card.actionCost, card.manaCost);

                // if the card is instant, wait at least 0.2 secs
                await Promise.all([
                    card.play(target ? [target] : enemyManager.activeEnemies),
                    wait(0.2),
                ]);

                cardManager.resolvePending();

                enemyManager.removeDead();
                if(
                    enemyManager.activeEnemies.length == 0
                    || player.currentHp <= 0
                ) {
                    return;
                }

                if(card.causesPass) {
                    retainOneTurn = card.causesPass == CAUSES_PASS_RETAIN_VALUE;
                    break;
                }
            }
        }

        if(!retainOneTurn) {
            await cardManager.discardHand();
        }
        retainOneTurn = false;

        /* enemy turn */
        // 1. bleed
        for(const e of enemyManager.activeEnemies) {
            await e.onStartOfTurn();

            enemyManager.removeDead();
            if(enemyManager.activeEnemies.length == 0) {
                return;
            }
        }

        // 2. actions
        const startOfRoundEnemies = [...enemyManager.activeEnemies];
        for(const enemy of startOfRoundEnemies) {
            // It's possible this got killed by a fellow enemy before
            // moving. If so, skip.
            if(enemy.currentHp <= 0) continue;
            await enemy.peekAction()[1](enemy, enemyManager.activeEnemies);
            enemyManager.removeDead();
            await wait(0.1);
            enemy.clearAction();
            await wait(0.5);
            if(player.currentHp <= 0) {
                return;
            }
        }

        if(enemyManager.activeEnemies.length == 0) {
            return;
        }

        /* reset */
        player.onStartOfTurn();
        if(player.currentHp <= 0) {
            // death by poison, probably
            return;
        }
        player.manaPoints += MANA_PER_ROUND;
        player.actionPoints = ACTIONS_PER_ROUND;
        player.render();

        enemyManager.activeEnemies.forEach(enemy => enemy.resetAction());
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
                for(const [el, enemy] of enemyManager.getTargetableElMap()) {
                    if(el.contains(e.target)) {
                        return resolve([activeCard, enemy]);
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
            if(dx ** 2 + dy ** 2 < 25 ** 2) {
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
            enemyManager.highlightTargetable();
        }
        window.addEventListener('mouseup', onMouseUp, {'once': true});
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('keydown', onKeyDown);
        cleanUp = () => {
            window.removeEventListener('mouseup', onMouseUp);
            window.removeEventListener('click', onEnd);
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('keydown', onKeyDown);
            enemyManager.unhighlightTargetable();
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
        && e.clientY <= top + 0.7 * height;
}

function getTravelDelta(a, b) {
    return [
        b.clientX - a.clientX,
        b.clientY - a.clientY,
    ];
}
