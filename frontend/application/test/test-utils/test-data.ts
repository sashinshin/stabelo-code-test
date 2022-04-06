const [FLOORS, ELEVATORS] = [20, 5];

const generateElevatorPositions = (): ElevatorPositions => {
    const floors = new Array(FLOORS).fill(false);
    floors[0] = true;
    const elevators = new Array(ELEVATORS).fill(undefined).map(() => [...floors]);
    return elevators;
};

export const mockedInitResponse = JSON.stringify({
    message: {
        floorsArray: Array.from(Array(FLOORS).keys()).reverse(),
        elevatorsArray: Array.from(Array(ELEVATORS).keys()),
        floors: (FLOORS - 1).toString(),
    }
});

export const mockedPositionsResponse = JSON.stringify({
    message: generateElevatorPositions()
});

const floorRef = new Array(20).fill(null).map(() => ({ current: { classList: { add: jest.fn(), remove: jest.fn() } } }));
const ref = new Array(5).fill(null).map(() => floorRef)
export const mockedUseRef = { current: ref }