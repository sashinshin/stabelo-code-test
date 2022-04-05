import config from "./config";
const { FLOORS } = config;

export const moveElevator = (destinationFloor: number, elevatorPositions) => {
    if (destinationFloor > FLOORS || 0 > destinationFloor) {
        throw new Error("Invalid destination floor")
    }

    for (let iterations = 0; FLOORS > iterations; iterations++) {
        for (let elevator = 0; elevatorPositions.length > elevator; elevator++) {
            const above = elevatorPositions[elevator][destinationFloor + iterations];
            if (above) {
                return {
                    elevator,
                    iterations,
                    above: true,
                    floorWithElevator: destinationFloor + iterations
                }
            }
            const below = elevatorPositions[elevator][destinationFloor - iterations];
            if (below) {
                return {
                    elevator,
                    iterations,
                    above: false,
                    floorWithElevator: destinationFloor - iterations
                }
            }
        };
    };

    throw new Error("Too many iterations")
}
