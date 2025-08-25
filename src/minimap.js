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
    currentFloor = -1;

    makeEl() {
        return div('C--minimap');
    }

    render() {
        setChildren(this.el,
            this.roomTypeByFloor.flatMap((roomType, i) => {
                if(i == 14) return div('', '👑');
                return [
                    div(i == 0 || i <= this.currentFloor ? 'C--visitedPath' : '', '#R?z'[roomType]),
                    div('C--mapArrow ' + (i < this.currentFloor && 'C--visitedPath'), '↑'),
                ];
            }),
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
