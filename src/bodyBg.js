class BodyBg extends Sprite{
    makeEl() {
        return div('C--bodyBgWrapper',
            SpriteSheetPic(54, '#301b45')(),
            SpriteSheetPic(54, '#301b45')(),
        );
    }

    async slideNext() {
        this.el.style.bottom = `-1000rem`;
        await wait(0.75);
        this.hide();
        this.showAndRender();
    }
}
