const cardLibrary = {
    // Each (standard) card definition takes up about 22bytes zipped.

    Paw: class extends RareCard{
        cardName = 'Paw';
        pic = SpriteSheetPic(4, '#ff32f1');

        damage = 0;
    },
    Claw: class extends CommonCard{
        cardName = 'Claw';
        pic = SpriteSheetPic(1, '#d0f');
        actionCost = 1;

        damage = 1;
    },
    Maul: class extends CommonCard{
        cardName = 'Maul';
        pic = SpriteSheetPic(5, '#f80');
        actionCost = 2;

        damage = 3;
    },
    BoomBopBam: class extends RareCard{
        cardName = 'Boom Bop Bam';
        pic = SpriteSheetPic(15, '#709a2b');
        actionCost = 2;

        damage = 1;
        repeatPlay = 3;
    },

    Swipe: class extends CommonCard{
        cardName = 'Swipe';
        pic = SpriteSheetPic(2, '#f50');
        actionCost = 1;

        targetMode = TARGET_TO_ALL;
        damage = 1;
        exhaust = true;
    },
    Scratch: class extends CommonCard{
        cardName = 'Scratch';
        actionCost = 1;
        pic = SpriteSheetPic(11, '#f00');

        bleed = 2;
    },
    SpiritScratch: class extends RareCard{
        cardName = 'Spirit Scratch';
        pic = SpriteSheetPic(2, '#ccf');

        targetMode = TARGET_TO_ALL;
        cantrip = 1;
        bleed = 1;
    },

    Meow: class extends CommonCard{
        cardName = 'Meow';
        pic = SpriteSheetPic(10, '#7fae10');
        actionCost = 1;

        draw = 2;
    },

    Bite: class extends RareCard{
        cardName = 'Bite';
        pic = SpriteSheetPic(6, '#f00');
        actionCost = 1;

        damage = 1;
        selfHeal = 1;
    },
    TongueBath: class extends LegendaryCard{
        cardName = 'Tongue Bath';
        pic = SpriteSheetPic(16, '#436');
        actionCost = 1;

        selfHeal = 4;
        exhaust = true;
    },

    BobaEyes: class extends RareCard{
        cardName = 'Boba Eyes';
        pic = SpriteSheetPic(9, '#406');
        manaCost = 2;

        gainStrength = 1;
    },

    Boop: class extends RareCard{
        cardName = 'Boop';
        pic = SpriteSheetPic(22, '#71b6cb');
        manaCost = 1;
        targetMode = TARGET_TO_ALL;
        getTextLines = () => ['Reverse Enemy Order'];
        play() {
            enemyManager.activeEnemies.reverse();
        }
    },

    // Hiss: class extends CommonCard{
    //     cardName = 'Hiss';
    //     actionCost = 1;

    //     fear = 1;
    // },

    // - dodge - next attack misses
    // - swat - move enemy left 1 spot
    // - stomp - stun 1 turn
    // - swipe - damage 1 to ALL


    ConveneWithSpirits: class extends LegendaryCard{
        cardName = 'Convene with Spirits';
        pic = SpriteSheetPic(7, '#0f7');
        // actionCost = 1;
        manaCost = 1;

        draw = 4;
        exhaust = true;
    },
    Channel: class extends RareCard{
        cardName = 'Channel';
        pic = SpriteSheetPic(8, '#3bf');
        manaCost = 0;

        gainMana = 2;
    },
    Stomp: class extends RareCard{
        cardName = 'Stomp';
        pic = SpriteSheetPic(20, '#e8961b');
        manaCost = 2;

        stun = 1;
    },
    Fireball: class extends CommonCard{
        cardName = 'Fireball';
        pic = SpriteSheetPic(12, '#f61');
        actionCost = 1;
        manaCost = 2;

        damage = 4;
        splashDamage = 2;
    },
    SeeGhost: class extends RareCard{
        cardName = 'See Ghost';
        manaCost = 2;

        pic = SpriteSheetPic(3, '#005f39');

        // getTextLines() { return ['Replay the Previous Card'] };
        getTextLines() { return ['TODO'] };
    },
    Zoomies: class extends RareCard{
        cardName = 'Zoomies';
        pic = SpriteSheetPic(13, '#496fcf');
        manaCost = 1;

        gainActions = 2;
    },
    WitchingHour: class extends LegendaryCard{
        cardName = 'Witching Hour';
        pic = SpriteSheetPic(14, '#353cfd');
        // manaCost = 0;

        gainActions = 2;
        gainMana = 2;
        exhaust = 1;
    },
    YarnBall: class extends TrinketCard{
        cardName = 'Yarn Ball';
        pic = SpriteSheetPic(17, '#8453ff');
        manaCost = 0;

        causesPass = CAUSES_PASS_RETAIN_VALUE;
        // exhaust = true;
    },

    Spellbook: class extends ItemCard{
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

    Spellbookmark: class extends TrinketCard{
        cardName = 'Spellbookmark';
        pic = SpriteSheetPic(19, '#1e44ae');

        cantrip = 1;
        damage = 2;
        targetMode = AT_LEFT_ENEMY;
    },

    RabbitsFoot: class extends ItemCard{
        cardName = 'Rabbit’s Foot';
        pic = SpriteSheetPic(21, '#f02');
        manaCost = 1;
        getTextLines = () => ['Redraw Your Hand'];

        draw = TURN_START_HAND_SIZE;
        async play(...args) {
            await cardManager.discardHand();
            await super.play(...args);
        }
    },

    WayOfTheWeasel: class extends LegendaryCard{
        cardName = 'Way of the Weasel';
        pic = SpriteSheetPic(50, '#c76d24');
        manaCost = 2;

        dodge = 5;
        exhaust = 1;
    },

    Dam: class extends TrinketCard{
        cardName = 'Dam';
        // TODO: reuse art from the Dam monster
        // pic = SpriteSheetPic(19, '#1e44ae');
        actionCost = 1;

        dodge = 1;
    },

    // - see ghost - replay the previous card
    // - 9 lives
};
