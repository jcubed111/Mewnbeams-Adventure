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

    Swipe: class extends CommonCard{
        cardName = 'Swipe';
        pic = SpriteSheetPic(2, '#f50');
        actionCost = 1;

        toAll = true;
        damage = 1;
        exhaust = true;
    },
    Scratch: class extends CommonCard{
        cardName = 'Scratch';
        actionCost = 1;
        pic = SpriteSheetPic(11, '#f00');

        bleed = 2;
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

    BobaEyes: class extends RareCard{
        cardName = 'Boba Eyes';
        pic = SpriteSheetPic(9, '#406');
        manaCost = 2;

        gainStrength = 1;
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
        actionCost = 1;
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
    Fireball: class extends CommonCard{
        cardName = 'Fireball';
        pic = SpriteSheetPic(12, '#f61');
        actionCost = 1;
        manaCost = 2;

        damage = 4;
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
        cardName = 'WitchingHour';
        pic = SpriteSheetPic(14, '#353cfd');
        // manaCost = 0;

        gainActions = 2;
        gainMana = 2;
    },

    // - fireball - damage 3
    // - see ghost - replay the previous card
    // - 9 lives
};
