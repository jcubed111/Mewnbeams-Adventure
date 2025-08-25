// ~15%, which is 0.48%/card
// card art file is ~25.5%, which is 0.45%/card
const cardLibrary = [
    // Each (standard) card definition takes up about 22bytes zipped.

    class extends CommonCard{
        cardName = 'Claw';
        pic = SpriteSheetPic(1, '#d0f');
        actionCost = 1;

        damage = 1;
    },

    class extends CommonCard{
        cardName = 'Scratch';
        actionCost = 1;
        pic = SpriteSheetPic(11, '#f00');

        bleed = 2;
    },

    class extends CommonCard{
        cardName = 'Swipe';
        pic = SpriteSheetPic(2, '#f50');
        actionCost = 1;

        targetMode = TARGET_TO_ALL;
        damage = 1;
        exhaust = true;
    },

    class extends RareCard{
        cardName = 'Stomp';
        pic = SpriteSheetPic(20, '#e8961b');
        manaCost = 2;

        stun = 1;
    },

    class extends CurseCard{
        cardName = 'Curse';
        pic = SpriteSheetPic(26, '#289876');
        cantrip = 1;
    },

    class extends ItemCard{
        cardName = 'Rabbit’s Foot';
        pic = SpriteSheetPic(21, '#f02');
        manaCost = 1;
        getTextLines = () => ['Redraw Your Hand'];

        draw = TURN_START_HAND_SIZE;
        async play(targets) {
            await cardManager.discardHand();
            await super.play(targets);
        }
    },

    class extends LegendaryCard{
        cardName = 'Way of the Weasel';
        pic = SpriteSheetPic(50, '#c76d24');
        manaCost = 2;

        dodge = 5;
        exhaust = 1;
    },

    class extends TrinketCard{
        cardName = 'Dam';
        // reuses art from the Dam monster
        pic = SpriteSheetPic(29, '#9d411a');
        actionCost = 1;

        dodge = 1;
    },

    class extends CommonCard{
        cardName = 'Fireball';
        pic = SpriteSheetPic(12, '#f61');
        actionCost = 1;
        manaCost = 2;

        damage = 4;
        splashDamage = 2;
    },

    class extends ItemCard{
        cardName = 'Spellbook';
        pic = SpriteSheetPic(18, '#7d2300');
        manaCost = 1;
        getTextLines = () => ['Draw your entire Draw Pile'];
        draw = 7;
        render(standalone) {
            super.render(standalone);
            this.draw = cardManager.drawPile.length;
        }
    },

    class extends TrinketCard{
        cardName = 'Spellbookmark';
        pic = SpriteSheetPic(19, '#1e44ae');

        cantrip = 1;
        damage = 2;
        targetMode = AT_LEFT_ENEMY;
    },

    class extends RareCard{
        cardName = 'Paw';
        pic = SpriteSheetPic(4, '#ff32f1');

        damage = 0;
    },
    class extends CommonCard{
        cardName = 'Maul';
        pic = SpriteSheetPic(5, '#f80');
        actionCost = 2;

        damage = 2;
        bleed = 2;
    },
    class extends RareCard{
        cardName = 'Boom Bop Bam';
        pic = SpriteSheetPic(15, '#709a2b');
        actionCost = 2;

        damage = 1;
        repeatPlay = 3;
    },

    class extends RareCard{
        cardName = 'Spirit Scratch';
        pic = SpriteSheetPic(2, '#ccf');

        targetMode = TARGET_TO_ALL;
        cantrip = 1;
        bleed = 1;
    },

    class extends CommonCard{
        cardName = 'Meow';
        pic = SpriteSheetPic(10, '#7fae10');
        actionCost = 0;

        cantrip = 1;
        draw = 2;
    },

    class extends RareCard{
        cardName = 'Bite';
        pic = SpriteSheetPic(6, '#f00');
        actionCost = 1;

        damage = 1;
        selfHeal = 1;
    },
    class extends LegendaryCard{
        cardName = 'Tongue Bath';
        pic = SpriteSheetPic(16, '#436');
        actionCost = 1;

        selfHeal = 4;
        exhaust = true;
    },

    class extends RareCard{
        cardName = 'Boba Eyes';
        pic = SpriteSheetPic(9, '#406');
        manaCost = 2;

        gainStrength = 1;
    },

    class extends RareCard{
        cardName = 'Boop';
        pic = SpriteSheetPic(22, '#71b6cb');
        manaCost = 1;
        targetMode = TARGET_TO_ALL;
        extraCardText = 'Reverse Enemy Order';
        play = () => enemyManager.activeEnemies.reverse();
    },

    class extends CommonCard{
        cardName = 'Swat';
        pic = SpriteSheetPic(28, '#a18600');
        actionCost = 1;

        damage = 1;
        extraCardText = 'Push to the right';
        play([target]) {
            const i = enemyManager.activeEnemies.indexOf(target);
            enemyManager.activeEnemies.splice(i, 1);
            enemyManager.activeEnemies.splice(i + 1, 0, target);
            return super.play([target]);
        }
    },

    class extends CommonCard{
        cardName = 'Prepare Spell';
        pic = SpriteSheetPic(23, '#ca8f5f');
        actionCost = 1;

        extraCardText = 'Add a Fireball to your Discard';
        play = () => cardManager.animateInto(
            ANIMATE_INTO_TARGET_DISCARD,
            new Card_Fireball,
        );
    },

    class extends ItemCard{
        cardName = 'Knapsack';
        pic = SpriteSheetPic(24, '#923303');
        manaCost = 1;

        extraCardText = 'Make a Random Trinket';
        play = () => cardManager.animateInto(
            ANIMATE_INTO_TARGET_HAND,
            getThreeRandomTrinkets()[0],
        );
    },

    class extends LegendaryCard{
        cardName = 'Dark Bargain';
        pic = SpriteSheetPic(25, '#f20');
        manaCost = 1;

        render(standalone) {
            super.render(standalone);
            this.damage = cardManager.cardsInPlay().filter(c => c.cardName == 'Curse').length;
        }

        async play(targets) {
            await cardManager.animateInto(
                ANIMATE_INTO_TARGET_DRAW,
                new Card_Curse,
            );
            super.play(targets);
        }

        getTextLines = () => ['Make a Curse', 'Attack 1 per Curse in Play'];
    },


    class extends RareCard{
        cardName = 'Blood Ritual';
        pic = SpriteSheetPic(27, '#f02');
        actionCost = 1;
        manaCost = 1;

        selfDamage = 2;
        gainStrength = 2;
    },

    // class extends CommonCard{
    //     cardName = 'Hiss';
    //     actionCost = 1;

    //     fear = 1;
    // },

    // - dodge - next attack misses
    // - swat - move enemy left 1 spot

    class extends LegendaryCard{
        cardName = 'Convene with Spirits';
        pic = SpriteSheetPic(7, '#0f7');
        // actionCost = 1;
        manaCost = 1;

        draw = 4;
        exhaust = true;
    },
    class extends CommonCard{
        cardName = 'Channel';
        pic = SpriteSheetPic(8, '#3bf');
        manaCost = 0;

        gainMana = 2;
    },
    class extends RareCard{
        cardName = 'See Ghost';
        manaCost = 1;

        pic = SpriteSheetPic(3, '#005f39');

        extraCardText = 'Make a ghostly copy of a discarded Card';
        playable() {
            return super.playable() && cardManager.discardPile.length;
        }
        async play() {
            const discard = cardManager.discardPile;
            const chosenIndex = await cardListViewScreen(discard, 0, 1)
            if(chosenIndex == -1) {
                return await this.play();
            }
            await cardManager.animateInto(
                ANIMATE_INTO_TARGET_HAND,
                ghostifyCard(new discard[chosenIndex].constructor),
            );
        }
    },

    // class extends TrinketCard{
    //     cardName = 'Vampire Bat Extract';
    //     actionCost = 1;
    //     pic = SpriteSheetPic(0, '#f0f');
    //     exhaust = 1;

    //     extraCardText = 'Make 3 ghostly Bites';
    //     async play() {
    //         await cardManager.animateInto(
    //             ANIMATE_INTO_TARGET_HAND,
    //             ghostifyCard(new Card_Bite),
    //         );
    //         await cardManager.animateInto(
    //             ANIMATE_INTO_TARGET_HAND,
    //             ghostifyCard(new Card_Bite),
    //         );
    //         await cardManager.animateInto(
    //             ANIMATE_INTO_TARGET_HAND,
    //             ghostifyCard(new Card_Bite),
    //         );
    //     }
    // },

    class extends RareCard{
        cardName = 'Zoomies';
        pic = SpriteSheetPic(13, '#496fcf');
        manaCost = 1;

        dodge = 1;
        gainActions = 2;
    },
    class extends LegendaryCard{
        cardName = 'Witching Hour';
        pic = SpriteSheetPic(14, '#353cfd');
        // manaCost = 0;

        gainActions = 2;
        gainMana = 2;
        exhaust = 1;
    },
    class extends TrinketCard{
        cardName = 'Yarn Ball';
        pic = SpriteSheetPic(17, '#8453ff');
        manaCost = 0;

        causesPass = CAUSES_PASS_RETAIN_VALUE;
        // exhaust = true;
    },


    // - see ghost - replay the previous card
    // - 9 lives
];
