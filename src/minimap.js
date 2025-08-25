class Minimap extends Sprite{
    roomTypeByFloor = [
        // first floor is always fight
        RoomType.Fight,

        // 2 - 4 are random nap, event, fight
        ...shuffleInPlace([
            RoomType.Fight,  // f=1
            RoomType.Nap,    // n=1
            RoomType.Event,  // e=1
        ]),

        // 5
        RoomType.Fight,      // f=1

        // 6 - 9
        ...shuffleInPlace([
            RoomType.Fight,  // f=2.4
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Nap,    // n=0.8
            RoomType.Event,  // e=0.8
        ]).slice(0, 4),

        // 10
        RoomType.Fight,      // f=1

        // 11 - 12
        ...shuffleInPlace([
            RoomType.Fight,  // f=0.67
            RoomType.Nap,    // n=0.67
            RoomType.Event,  // e=0.67
        ]).slice(0, 2),

        // 13
        RoomType.Fight,      // f=1

        // 14
        shuffleInPlace([
            RoomType.Fight,  // f=0.5
            RoomType.Nap,    // n=0.5
        ])[0],

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
