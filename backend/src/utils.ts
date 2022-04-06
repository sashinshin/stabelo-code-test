import config from "./config";
const { FLOORS, ELEVATORS } = config;

export const generateElevatorPositions = (): ElevatorPositions => {
    const floors = new Array(FLOORS).fill(false);
    floors[0] = true;
    const elevators = new Array(ELEVATORS).fill(undefined).map(() => [...floors]);
    return elevators;
};

export const getMoveElevatorData = (
    destinationFloor: number,
    serverData: ServerData
): MovingElevatorData => {
    if (destinationFloor >= FLOORS || 0 > destinationFloor) {
        throw new Error("Invalid destination floor");
    }
    for (let iterations = 0; FLOORS > iterations; iterations++) {
        for (let elevator = 0; serverData.elevatorPositions.length > elevator; elevator++) {

            if (!serverData.movingElevators.includes(elevator)) {
                const elevatorAbove = serverData.elevatorPositions[elevator][destinationFloor + iterations];
                const elevatorBelow = serverData.elevatorPositions[elevator][destinationFloor - iterations];
                if (elevatorAbove || elevatorBelow) {
                    return {
                        elevator,
                        iterations,
                        elevatorAbove,
                        floorWithElevator: elevatorAbove ? destinationFloor + iterations : destinationFloor - iterations,
                    };
                }
            }
        }
    }
    throw new Error("No elevator available");
};

export const moveElevator = (
    floorsTravelled: number,
    floorsToTravel: number,
    elevator: number,
    elevatorAbove: boolean,
    floorWithElevator: number,
    serverData: ServerData
): void => {
    if (floorsToTravel > floorsTravelled) {
        setTimeout(() => {
            const newFloorWithElevator = elevatorAbove ? floorWithElevator - 1 : floorWithElevator + 1;
            serverData.elevatorPositions[elevator][floorWithElevator] = false;
            serverData.elevatorPositions[elevator][newFloorWithElevator] = true;

            moveElevator(floorsTravelled + 1, floorsToTravel, elevator, elevatorAbove, newFloorWithElevator, serverData);
        }, 2000);
    } else {
        serverData.movingElevators = serverData.movingElevators.filter((movingElevator) => movingElevator !== elevator);
    }
};