const RoomType = {
    Fight: 0,
    Boss: 1,
    Event: 2,
    Nap: 3,
};

const roomGen = function* getRandomRoom() {
    while(true) {
        yield* shuffleInPlace([
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Event,
            RoomType.Nap,
        ]);
    }
}();

class Minimap extends Sprite{
    roomTypesByFloor;
    nextAvailableDirectionsByFloorByRoom;

    visitedRoomIndexByFloor = [0];
    chosenDirectionByFloorByRoom = range(0, NUM_FLOORS).map(_ => [0, 0, 0]);

    currentFloor = 0;
    currentRoomIndex = 0;

    constructor() {
        super();
        this.roomTypesByFloor = [[RoomType.Fight]];
        for(let floorIndex = 1; floorIndex < NUM_FLOORS; floorIndex++) {
            const previousNum = this.roomTypesByFloor[floorIndex - 1].length;
            const nextNum = shuffleInPlace([,[2], [1, 2, 3, 3], [2, 2, 3]][previousNum])[0];
            this.roomTypesByFloor[floorIndex] = range(0, nextNum).map(() => roomGen.next().value);
        }
        this.roomTypesByFloor[NUM_FLOORS - 1] = [RoomType.Boss];
        this.roomTypesByFloor[NUM_FLOORS - 2] = shuffleInPlace([RoomType.Fight, RoomType.Nap]);

        // Floor transition bitmaps
        const Left = 1;      // = [1, 0, 0];  // where the first item is "1"
        const Straight = 2;  // = [0, 1, 0];
        const Right = 4;     // = [0, 0, 1];
        const Both = 5;      // = [1, 0, 1];

        this.nextAvailableDirectionsByFloorByRoom = this.roomTypesByFloor.map((roomTypes, floorIndex) => {
            const roomCount = roomTypes.length;
            const nextRoomCount = this.roomTypesByFloor[floorIndex + 1]?.length ?? 0;

            const third = ~~(Math.random() * 3);

            if(nextRoomCount == 0) {
                return [0];

            }else if(nextRoomCount == roomCount) {
                return [Straight, Straight, Straight];

            }else if(nextRoomCount == 3) {
                // roomCount must be 2
                return [
                    [Both, Both],
                    [Left, Both],
                    [Both, Right],
                ][third];

            }else if(nextRoomCount == 1) {
                // roomCount must be 2
                return [Right, Left];

            }else if(roomCount == 1) {
                // nextRoomCount must be 2
                return [Both];
            }else{
                // roomCount must be 3
                // nextRoomCount must be 2
                return [Right, [Both, Left, Right][third], Left];
            }
        });
    }

    makeEl() {
        return div('C--minimap');
    }

    render() {
        setChildren(this.el,
            range(0, NUM_FLOORS).flatMap(fi => [
                this.drawFloorRow(fi),
                this.drawFloorTransition(fi),
            ]).map(r => div('.C--minimapRow', r)),
        );
    }

    drawFloorRow(fi) {
        return this.roomTypesByFloor[fi].flatMap((roomType, roomIndex) => {
            return ['   ', span(
                this.visitedRoomIndexByFloor[fi] == roomIndex && 'C--visitedPath',
                ['@M?Z'[roomType]],
            )];
        }).slice(1);
    }

    drawFloorTransition(fi) {
        return this.roomTypesByFloor[fi].flatMap((_, ri) => {
            return [' ', ...range(0, 3).map(optIndex => {
                const optBitmapValue = 1 << optIndex;
                const available = this.nextAvailableDirectionsByFloorByRoom[fi][ri] & optBitmapValue;
                const done = this.chosenDirectionByFloorByRoom[fi][ri] & optBitmapValue;
                if(!available) return ' ';
                return span(
                    done && 'C--visitedPath',
                    ['\\|/'[optIndex]]
                );
            })];
        }).slice(1);
    }
}
