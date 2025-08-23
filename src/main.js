const enemyManager = new EnemyManager();
const cardManager = new CardManager();
const player = new Player();
const minimap = new Minimap();
const bodyBg = new BodyBg();

async function main() {
    // keep this here so it doesn't get optimized out
    zzfx(...[,,925,.04,.3,.6,1,.3,,6.27,-184,.09,.17]); // Game Over

    // document.body.style.background = spriteBgForIndex(54) + '#1f1826';
    bodyBg.showAndRender();
    // await wait(1);
    // await bodyBg.slideNext();
    // await wait(10);

    await runMainMenu();

    // await runBattle([
    //     new monsterLibrary.BasicRat(),
    //     new monsterLibrary.RatGuard(),
    //     new monsterLibrary.RatWizard(),
    // ]);
}
window.addEventListener('load', main);

