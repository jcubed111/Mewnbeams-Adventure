class Minimap extends Sprite{
    roomTypeByFloor = [
        // first floor is always fight
        RoomType.Fight,

        // 2 - 4 are random nap, event, fight
        ...shuffleInPlace([
            RoomType.Fight,
            RoomType.Nap,
            RoomType.Event,
        ]),

        ...shuffleInPlace([
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Nap,
            RoomType.Nap,
            RoomType.Event,
        ]).slice(0, 5),

        ...shuffleInPlace([
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Nap,
            RoomType.Nap,
            RoomType.Event,
        ]).slice(0, 5),

        // 15 is boss
        RoomType.Boss,
    ];
    roomPositionByFloor = range(14).reduce(acc => {
        const prev = acc[0];
        const next = shuffleInPlace([
            // 0 -> 0 or 1
            [0, 1, 1],
            // 1 -> 0 or 1 or 2
            [0, 0, 1, 2, 2],
            // 2 -> 1 or 2
            [1, 1, 2],
        ][prev])[0];
        return [next, ...acc];
    }, [1]);
    currentFloor = -1;

    makeEl() {
        return div('C--minimap');
    }

    render() {
        setChildren(this.el,
            range(NUM_FLOORS).flatMap(fi => {
                const roomType = this.roomTypeByFloor[fi];
                const roomPosition = this.roomPositionByFloor[fi];
                const nextRoomPosition = this.roomPositionByFloor[fi + 1];

                const floorText = (
                    ' '.repeat(1 + 2 * roomPosition)
                    + '#R?z'[roomType]
                    + ' '.repeat(5 - 2 * roomPosition)
                );

                const transitionText = (
                    ' '.repeat(2 * roomPosition)
                    + [
                        '\\  ',
                        ' | ',
                        '  /',
                    ][nextRoomPosition - roomPosition + 1]
                    + ' '.repeat(4 - 2 * roomPosition)
                );

                return [
                    div(fi <= this.currentFloor && 'C--visitedPath', floorText),
                    div(fi < this.currentFloor && 'C--visitedPath', transitionText),
                ];
            }).slice(0, -1),
        );
    }

    async getNextFloor() {
        this.currentFloor++;
        this.render();
        return this.roomTypeByFloor[this.currentFloor];
    }
}


/*

  K
  |
  %
 /
%
 \
  $
   \
    $
    |
    %
   /
  %
  |
  %
  |
  %
 /
@

\|X|X|/
 . . .

*/
