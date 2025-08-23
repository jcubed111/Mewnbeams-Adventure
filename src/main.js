const bodyBg = new BodyBg();

async function main() {
    bodyBg.showAndRender();

    await runMainMenu();

    // await runBattle([
    //     new enemyLibrary.BasicRat(),
    //     new enemyLibrary.RatGuard(),
    //     new enemyLibrary.RatWizard(),
    // ]);
}
window.addEventListener('load', main);

