class BodyBg extends Sprite{
    makeEl() {
        return div('',
            div('C--bodyBgWrapper',
                SpriteSheetPic(54, '#301b45')(),
                SpriteSheetPic(54, '#301b45')(),
            ),
            div('C--bodyBgStars',
                SpriteSheetPic(42, '#0000')(),
                SpriteSheetPic(43, '#0000')(),
            ),
        );
    }

    async slideNext() {
        this.el.style.bottom = `-1000rem`;
        await wait(0.75);
        this.hide();
        this.showAndRender();
    }
}
