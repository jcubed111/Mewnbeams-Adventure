const cardLibrary = {
    // Each (standard) card definition takes up about 22bytes zipped.

    Paw: class extends RareCard{
        cardName = 'Paw';
        actionCost = 0;

        damage = 0;
    },
    Claw: class extends CommonCard{
        cardName = 'Claw';
        actionCost = 1;
        pic = SpriteSheetPic(1, '#d0f');

        damage = 1;
    },
    Maul: class extends CommonCard{
        cardName = 'Maul';
        actionCost = 2;

        damage = 3;
    },

    Swipe: class extends CommonCard{
        cardName = 'Swipe';
        actionCost = 1;
        pic = SpriteSheetPic(2, '#f50');

        toAll = true;
        damage = 1;
        exhaust = true;
    },
    Scratch: class extends CommonCard{
        cardName = 'Scratch';
        actionCost = 1;

        bleed = 2;
    },

    Meow: class extends CommonCard{
        cardName = 'Meow';
        actionCost = 1;

        draw = 2;
    },
    // Bite: class extends CommonCard{
    //     cardName = 'Bite';
    //     actionCost = 1;

    //     damage = 1;
    //     selfHeal = 1;
    // },
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
        actionCost = 1;
        manaCost = 1;

        draw = 4;
        exhaust = true;
    },
    Channel: class extends RareCard{
        cardName = 'Channel';
        actionCost = 0;
        manaCost = 0;

        gainMana = 2;
    },
    SeeGhost: class extends RareCard{
        cardName = 'See Ghost';
        actionCost = 0;
        manaCost = 2;

        pic = SpriteSheetPic(3, '#0f0');

        getTextLines() { return ['Replay the Previous Card'] };
    },

    // - fireball - damage 3
    // - see ghost - replay the previous card
    // - 9 lives
};
