const bodyBg = new BodyBg();

async function main() {
    bodyBg.showAndRender();

    await runMainMenu();

    // await runBattle([
    //     new monsterLibrary.BasicRat(),
    //     new monsterLibrary.RatGuard(),
    //     new monsterLibrary.RatWizard(),
    // ]);
}
window.addEventListener('load', main);

