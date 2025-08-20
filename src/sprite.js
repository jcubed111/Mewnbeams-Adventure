class Sprite{
    el = null;
    makeEl() {
        return div();
    }

    showAndRender(...renderArgs) {
        if(!this.el) {
            this.el = this.makeEl();
            document.body.appendChild(this.el);
        }
        this.render(...renderArgs);
    }
    render() {}
    hide() {
        this.el?.remove();
        this.el = null;
    }

    async fadeOut() {
        this.el.style.opacity = 0;
        this.el.style.pointerEvents = 'none';
        await wait(0.5);
    }
}

const SpriteSheetPic = (index, primaryColor) => () => styledDiv('C--spriteSheetPic', {
    background: `url(c.webp) ${(index % 5) * 25}% ${(~~(index / 5)) * 10}%/500% ${primaryColor}`,
});
