const enemyManager = new EnemyManager();
const cardManager = new CardManager([
    new cardLibrary.Claw(),
    new cardLibrary.Scratch(),
    // new cardLibrary.Claw(),
    new cardLibrary.Meow(),
    // new cardLibrary.Meow(),
    // new cardLibrary.ConveneWithSpirits(),
    // new cardLibrary.Meow(),
    // new cardLibrary.Meow(),
    // new cardLibrary.Meow(),
    // new cardLibrary.Swipe(),
    // new cardLibrary.Swipe(),
    // new cardLibrary.SeeGhost(),
    new cardLibrary.Channel(),
]);
const player = new Player();


async function main() {
    // keep this here so it doesn't get optimized out
    zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]); // Game Over

    console.log([...Object.values(cardLibrary)]);

    player.showAndRender();

    await runMainMenu();

    // await runBattle([
    //     new monsterLibrary.BasicRat(),
    //     new monsterLibrary.RatGuard(),
    //     new monsterLibrary.RatWizard(),
    // ]);
}
window.addEventListener('load', main);
