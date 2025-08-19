const cardLibrary = {
    // Each (standard) card definition takes up about 22bytes zipped.

    Claw: class extends Card{
        cardName = 'Claw';
        primaryColor = '#822';
        actionCost = 1;
        pic = CardPic(1, 290);

        damage = 1;
    },
    // Maul: class extends Card{
    //     cardName = 'Maul';
    //     primaryColor = '#822';
    //     actionCost = 2;

    //     damage = 3;
    // },
    // Paw: class extends Card{
    //     cardName = 'Paw';
    //     primaryColor = '#822';
    //     actionCost = 0;

    //     damage = 0;
    // },
    Swipe: class extends Card{
        cardName = 'Swipe';
        primaryColor = '#b52';
        actionCost = 1;
        pic = CardPic(2, 20);

        toAll = true;
        damage = 1;
        exhaust = true;
    },
    // Scratch: class extends Card{
    //     cardName = 'Scratch';
    //     primaryColor = '#822';
    //     actionCost = 1;

    //     bleed = 1;
    // },
    Meow: class extends Card{
        cardName = 'Meow';
        primaryColor = '#822';
        actionCost = 1;

        draw = 2;
    },
    // Bite: class extends Card{
    //     cardName = 'Bite';
    //     primaryColor = '#822';
    //     actionCost = 1;

    //     damage = 1;
    //     selfHeal = 1;
    // },
    // Hiss: class extends Card{
    //     cardName = 'Hiss';
    //     primaryColor = '#822';
    //     actionCost = 1;

    //     fear = 1;
    // },

    // - dodge - next attack misses
    // - swat - move enemy left 1 spot
    // - stomp - stun 1 turn
    // - swipe - damage 1 to ALL


    ConveneWithSpirits: class extends Card{
        cardName = 'Convene with Spirits';
        primaryColor = '#84c';
        actionCost = 1;
        manaCost = 1;

        draw = 4;
        exhaust = true;
    },
    Channel: class extends Card{
        cardName = 'Channel';
        primaryColor = '#822';
        actionCost = 0;
        manaCost = 0;

        gainMana = 2;
    },
    SeeGhost: class extends Card{
        cardName = 'See Ghost';
        primaryColor = '#822';
        actionCost = 0;
        manaCost = 2;

        pic = CardPic(3, 120);

        getTextLines() { return ['Replay the Previous Card'] };
    },

    // - fireball - damage 3
    // - see ghost - replay the previous card
    // - 9 lives
};
