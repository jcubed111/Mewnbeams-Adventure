class EnemyManager{
    activeEnemies = [];

    render(pending=[]) {
        const SPACING = 60;
        const totalWidth = this.activeEnemies
            .map(e => e.size)
            .reduce((a, b) => a + b, 0)
            + SPACING * (this.activeEnemies.length - 1);

        let x = 666 - totalWidth / 2;
        for(const enemy of this.activeEnemies) {
            enemy.showAndRender();
            enemy.el.style.bottom = (
                pending.includes(enemy)
                    ? `1100rem`
                    : enemy.guard ? `600rem` : `700rem`
            );
            enemy.el.style.left = `${x}rem`;
            x += enemy.size + SPACING;
        }
    }

    async animateIn(enemies, insertAt=100) {
        this.activeEnemies.splice(insertAt, 0, ...enemies);
        this.render(enemies);
        await wait(0.05);
        this.render();
        await wait(0.4);
    }

    getElMap() {  // -> Array<[Element, Enemy]>
        return this.activeEnemies.map(e => [e.el, e]);
    }

    clear() {
        this.activeEnemies.forEach(e => e.hide());
        this.activeEnemies = [];
    }

    async removeDead() {
        const dead = this.activeEnemies.filter(e => e.currentHp <= 0);
        this.activeEnemies = this.activeEnemies.filter(e => e.currentHp > 0);
        dead.forEach(async enemy => {
            await enemy.fadeOut();
            enemy.hide();
        });
        await wait(0.4);
        this.render();
    }
}
