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
    // The numbers here are higher than "perfect" so that we trim off a tiny border from each
    // side of the image. This prevents adjacent sprites from bleeding through when
    // the sprite undergoes transforms.
    background: `url(c.webp) ${0.1 + (index % 5) * 24.95}% ${0.1 + 9.98 * (~~(index / 5))}%/506% ${primaryColor}`,
});
