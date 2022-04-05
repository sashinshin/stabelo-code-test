interface ServerData {
    elevatorPositions:boolean[][];
    patchCallsBlocked: boolean;
}

type ElevatorPositions = boolean[][];

interface MovingElevatorData {
    elevator: number;
    iterations: number;
    elevatorAbove: boolean;
    floorWithElevator: number;
}