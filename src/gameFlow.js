async function runMainMenu() {
    // placeholder - remove
    // await cardListViewScreen([...Object.values(cardLibrary)].map(C => new C));
    // await runBattle([
    //     new monsterLibrary.BasicRat(),
    //     new monsterLibrary.RatGuard(),
    //     new monsterLibrary.RatWizard(),
    // ]);
    //////////////

    const selection = await showChoiceMenu(ChoiceMenuTitle,
        plainElement('h1', ['Mewnbeam’s Quest']),
        'Start',
        'Library',
    );
    if(selection == 0) {
        await runGameRun();
    }else{
        await cardListViewScreen(
            [...Object.values(cardLibrary)].map(C => new C),
            true,
            false,
            'Library',
        );
    }

    return await runMainMenu();
}

async function runGameRun() {
    player.showAndRender();
    minimap.showAndRender();
    cardManager.render();

    /* OPENING */
    const choice = await showChoiceMenu(ChoiceMenuTextEvent,
        fadeInText`Mewnbeam, would you be a dear and ${plainElement('i', [`take care of`])} that ${plainElement('b', [`Rat King`])} while I’m out?${br()}${br()}He should be easy to find, he’s been causing lots of trouble up in the attic.`,
        'Mrow?',
        'Hiiisssss!',
    );
    if(choice == 0) {
        await showChoiceMenu(ChoiceMenuTextEvent,
            fadeInText`Shouldn’t be a big deal, just remember: ${plainElement('i', [`Mana`])} carries over, but ${plainElement('b', [`actions`])} reset every round.`,
            'Hiiisssss?'
        );
    }
    const flavorTextStore = shuffleInPlace([
        'potion shop',
        'apothecary',
        'grave yard',
        'broom emporium',
    ])[0];
    const choices = [
        new cardLibrary.Fireball(),
        new cardLibrary.Spellbookmark(),
        new cardLibrary.YarnBall(),
    ];
    const boonChoice = await showChoiceMenu(ChoiceMenuTextEventReward,
        fadeInText`Hmph. Alright.${br()}${br()}I do need to be off to the ${flavorTextStore}, but I suppose I could give you some help before I go.${br()}${br()}What’ll it be?`,
        ...choices.map(c => c.asStaticElement()),
    );
    cardManager.addToDeck(choices[boonChoice]);

    /* Floors */
    for(let floorIndex = 0; floorIndex < NUM_FLOORS; floorIndex++) {
        /* Direction Choice */
        if(floorIndex > 0) {
            const directionChoices = minimap.getAdvanceOptions();
            const choiceIndex = directionChoices.length > 1
                ? await showChoiceMenu(ChoiceMenuCardReward,
                    `Where to?`,
                    ...directionChoices.map(c => c[1]),
                )
                : 0;
            minimap.advance(directionChoices[choiceIndex][0]);
        }

        const chosenFloorType = minimap.getCurrentFloorType();

        if(chosenFloorType == RoomType.Nap) {
            await runNap();

        }else if(chosenFloorType == RoomType.Event) {
            await showChoiceMenu(ChoiceMenuTextEventReward, 'Event TODO', 'Go');
            // Note: we don't check for death here because none
            // of the events can (yet) kill you.

        }else{  // Fight or Boss
            const [monsters, cardRewards] = fightGenerator(floorIndex);
            await runBattle(monsters);

            /* Death :'( */
            if(player.currentHp <= 0) {
                await deathScreen();
                return;
            }

            /* Card Reward */
            if(floorIndex < NUM_FLOORS - 1) {
                const cardChoice = await showChoiceMenu(ChoiceMenuCardReward,
                    `Choose...`,
                    ...cardRewards.map(c => c.asStaticElement()),
                    "Pass",
                );
                if(cardChoice < cardRewards.length) {
                    cardManager.addToDeck(cardRewards[cardChoice]);
                }
            }
        }
    }

    /* Victory! :D */
    await victoryScreen();
}


async function runNap() {
    const napChoice = await showChoiceMenu(ChoiceMenuCardReward,
        `This looks like a cozy spot!`,
        `Sleep (Heal ${NAP_HEAL_AMOUNT})`,
        'Lick (Remove a Card)',
    );
    if(napChoice == 0) {
        player.heal(NAP_HEAL_AMOUNT);

    }else{
        const removeIndex = await cardListViewScreen(
            cardManager.deck,
            false,
            true,
            'Remove a Card...',
        );
        // If we clicked back, just run the nap again
        if(removeIndex == -1) return await runNap();
        cardManager.removeDeckIndex(removeIndex);
    }
}

function fightGenerator(floorIndex) {
    // Returns [monsters, card reward choices]
    // Both monsters and cardRewardChoices are instance arrays, not constructor arrays.
    // if(floorIndex == 0) return [[new monsterLibrary.BasicRat], getCardRewards(floorIndex)]
    return [
        [
            new monsterLibrary.BasicRat,
            new monsterLibrary.RatGuard,
            // new monsterLibrary.RatWizard,
            new monsterLibrary.PoisonRat,
        ],
        getCardRewards(floorIndex),
    ];
}

function getCardRewards(floorIndex) {
    const cardsByTier = [[], [], []];
    [...Object.values(cardLibrary)]
        .map(C => new C)
        .forEach(c => cardsByTier[c.rarityOrder]?.push(c));
    cardsByTier.forEach(shuffleInPlace);

    return range(0, 3).map(i => {
        // This function:
        //     floor( 2.4 * random() ^ goodness )
        // approximates a weighted random.
        // At goodness=1.7, it gives:
        //     60% often => 0  (common)
        //     30% often => 1  (rare)
        //     10% often => 2  (legendary)
        // At goodness=0.9, it gives:
        //     38% often => 0  (common)
        //     43% often => 1  (rare)
        //     19% often => 2  (legendary)
        const goodnessFactor = 1.7 - 0.8 * (floorIndex / (NUM_FLOORS - 1));
        const rolledRarity = ~~(2.4 * Math.random() ** goodnessFactor);
        return cardsByTier[rolledRarity].pop();
    });
}


async function runBattle(enemies) {
    enemyManager.clear();
    cardManager.resetForRound();

    player.manaPoints = INITIAL_MANA;
    player.actionPoints = ACTIONS_PER_ROUND;
    player.strength = 0;
    player.bleed = 0;
    player.render();

    await wait(0.1);

    await enemyManager.animateIn(enemies);

    await runBattleMain();

    // cleanup
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
                if(enemyManager.activeEnemies.length == 0) {
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
            enemy.peekAction().run(enemy, enemyManager.activeEnemies);
            enemyManager.removeDead();
            await wait(0.1);
            enemy.clearAction();
            await wait(0.5);
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
