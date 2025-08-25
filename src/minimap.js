// ~4%
const RoomType = {
    Fight: 0,
    Boss: 1,
    Event: 2,
    Nap: 3,
};

function* getRoomsGenerator() {
    for(let i = 0; true; i++) {
        yield* shuffleInPlace([
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            RoomType.Fight,
            // Don't make more than 4 events
            i > 4 ? RoomType.Fight : RoomType.Event,
            RoomType.Nap,
            RoomType.Nap,
        ]);
    }
};

class Minimap extends Sprite{
    // Apologies to anyone reading this class, it's a complete mess. I tried
    // to use a bunch of fancy bitmapping to make the code short but idek if
    // it helped lol.

    roomTypesByFloor;
    nextAvailableDirectionsByFloorByRoom;

    visitedRoomIndexByFloor = [0];
    chosenDirectionByFloorByRoom = range(NUM_FLOORS).map(_ => [0, 0, 0]);

    currentFloor = -1;
    currentRoomIndex = 0;

    constructor() {
        super();
        const roomGen = getRoomsGenerator();
        this.roomTypesByFloor = [[RoomType.Fight]];
        for(let floorIndex = 1; floorIndex < NUM_FLOORS; floorIndex++) {
            const previousNum = this.roomTypesByFloor[floorIndex - 1].length;
            const nextNum = shuffleInPlace([,[2], [1, 2, 3, 3], [2, 2, 3]][previousNum])[0];
            this.roomTypesByFloor[floorIndex] = range(nextNum).map(() => roomGen.next().value);
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
            range(NUM_FLOORS).flatMap(fi => [
                this.drawFloorRow(fi),
                this.drawFloorTransition(fi),
            ]).map(r => div('.C--minimapRow', r)).slice(0, -1),
        );
    }

    drawFloorRow(fi) {
        return this.roomTypesByFloor[fi].flatMap((roomType, roomIndex) => {
            return ['   ', span(
                this.visitedRoomIndexByFloor[fi] == roomIndex && 'C--visitedPath',
                '#R?z'[roomType],
            )];
        }).slice(1);
    }

    drawFloorTransition(fi) {
        return this.roomTypesByFloor[fi].flatMap((_, ri) => {
            return [' ', ...this.getAvailableDirections(fi, ri).map(([available, wasChosen], optIndex) => {
                if(!available) return ' ';
                return span(
                    wasChosen && 'C--visitedPath',
                    '\\|/'[optIndex],
                );
            })];
        }).slice(1);
    }

    async getNextFloor() {
        // returns next floor type
        if(this.currentFloor >= 0) {
            const directionChoices = this.getAdvanceOptions();
            const choiceIndex = directionChoices.length > 1
                ? await showChoiceMenu(ChoiceMenuDefault,
                    `Where to?`,
                    0,
                    ...directionChoices.map(c => c[1]),
                )
                : 0;
            // the argument to this is the first part of the option tuple from `getAdvanceOptions`
            const [[optBitmapValue, deltaIndex]] = directionChoices[choiceIndex];
            // returns to room type
            this.chosenDirectionByFloorByRoom[this.currentFloor][this.currentRoomIndex] = optBitmapValue;
            this.currentRoomIndex += deltaIndex;
        }
        this.currentFloor++;
        this.visitedRoomIndexByFloor[this.currentFloor] = this.currentRoomIndex;
        this.render();
        return this.roomTypesByFloor[this.currentFloor][this.currentRoomIndex];
    }

    getAvailableDirections(fi, ri) {
        // returns [
        //     [canGoLeft, didGoLeft, indexDelta],
        //     [canGoStraight, didGoStraight, indexDelta],
        //     [canGoRight, didGoRight, indexDelta]
        // ];
        // indexDelta is the change in roomIndex if that path is chosen
        const currentRoomCount = this.roomTypesByFloor[fi].length;
        const nextRoomCount = this.roomTypesByFloor[fi + 1]?.length ?? 2;

        const indexDeltas = [
            // left is -1 if there are fewer rooms on the next floor
            nextRoomCount < currentRoomCount ? -1 : 0,
            // straight is always 0
            0,
            // right is 1 if there are more rooms on the next floor
            nextRoomCount > currentRoomCount ? 1 : 0,
        ];

        return indexDeltas.map((indexDelta, optIndex) => {
            const optBitmapValue = 1 << optIndex;
            const available = this.nextAvailableDirectionsByFloorByRoom[fi][ri] & optBitmapValue;
            const wasChosen = this.chosenDirectionByFloorByRoom[fi][ri] & optBitmapValue;
            return [available, wasChosen, indexDelta];
        });
    }

    getAdvanceOptions() {
        // returns [[optBitmapValue, deltaIndex], directionChoiceLabel][]
        const dirs = this.getAvailableDirections(this.currentFloor, this.currentRoomIndex);
        return dirs.map(([available, _, deltaIndex], optIndex) => {
            if(!available) return null;
            const optBitmapValue = 1 << optIndex;

            const directionLabel = ['Left', 'Straight', 'Right'][optIndex];
            const toRoomType = this.roomTypesByFloor[this.currentFloor + 1][this.currentRoomIndex + deltaIndex];
            const roomKindLabel = ['Fight', 'The Rat King', 'Event', 'Nap'][toRoomType];

            return [
                [optBitmapValue, deltaIndex],
                div('',
                    div('C--directionChoiceLabel', directionLabel),
                    roomKindLabel,
                ),
            ];
        }).filter(_=>_);
    }
}
